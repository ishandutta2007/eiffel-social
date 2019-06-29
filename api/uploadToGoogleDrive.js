const HOOTSUITE_QID = 1;

const queueSelectQuery = 'select jid from queue_items where qid=$1 limit 1';
const queueDeleteQuery = 'delete from queue_items where qid=$1 and jid=$2';
const jacketSelectQuery = 'select * from jackets where jid=$1';
const photosSelectQuery = 'select pid from photos where jid=$1';
const photoSelectQuery = 'select image from photos where jid=$1 and pid=$2';

const uidFolderConfig = require('./uidFolderConfig.json');

const getQueueJid = async (db) => {
    const queueSelectResult = await db.query(queueSelectQuery, [HOOTSUITE_QID]);
    if (!queueSelectResult.rows.length) { return false; }
    return queueSelectResult.rows[0].jid;
};

const getJacket = async (jid, db) => {
    const jacketSelectResult = await db.query(jacketSelectQuery, [jid]);
    if (!jacketSelectResult.rows.length) { throw { message: `No such jacket ${jid}` }; }
    const jacket = jacketSelectResult.rows[0];
    return jacket;
};

const getPhotoIds = async (jid, db) => {
    const photosSelectResult = await db.query(photosSelectQuery, [jid]);
    return photosSelectResult.rows.map((row) => row.pid);
};

const imageDataUriRegexp = new RegExp('^data:(image/.{3,16});base64,');
const getPhoto = async (jid, pid, db) => {
    const photoSelectResult = await db.query(photoSelectQuery, [jid, pid]);
    if (!photoSelectResult.rows.length) { throw { message: `No such photo ${jid} ${pid}` }; }
    const imageDataUri = photoSelectResult.rows[0].image;
    const match = imageDataUri.match(imageDataUriRegexp);
    return {
        type: match[1],
        // keep in base64 rather than backconverting: Buffer.from(imageDataUri.slice(match[0].length), 'base64'),
        image: imageDataUri.slice(match[0].length),
    };
};

const got = require('got');
const AuthService = require('./components/auth/auth.service.js');
const processPhoto = async (jid, pid, db) => {
    // get image data and MIME type
    const photo = await getPhoto(jid, pid, db);
    // get API connector
    const { oauthApiCall } = new AuthService(db);
    // form file metadata and body
    const jacket = await getJacket(jid, db);
    const { jacketnumber, juid } = jacket; // PostgreSQL is case insensitive so jacketNumber is not camel case
    const folderId = uidFolderConfig[juid];
    const mediaData = {
        contentHints: { indexableText: JSON.stringify(jacket) },
        description: jacketnumber,
        fields: 'id', // generate a partial response with only the ID
        mimeType: photo.type,
        name: `${jacketnumber} ++ ${pid}`,
        parents: [folderId],
    };
    const multipart = [
        { 'Content-Type': 'application/json', body: JSON.stringify(mediaData) },
        // Hack the content type on the image data to include the base64 encoding
        { 'Content-Type': `${mediaData.mimeType}\r\nContent-Transfer-Encoding: base64`, body: photo.image },
    ];
    // call file upload endpoint
    const response = await oauthApiCall('google', 'POST', '/upload/drive/v3/files?uploadType=multipart', multipart);
    return response.id;
};

const initDb = require('./lib/initDb.js')(console);
initDb.then(async (db) => {

    while (true) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const jid = await getQueueJid(client);
            if (jid === false) { throw { message: 'No more queued jackets!' }; }
            const pids = await getPhotoIds(jid, client);
            const fileIds = await Promise.all(pids.map((pid) => processPhoto(jid, pid, client)));
            Array.from({ length: pids.length }, (_, index) => console.log(`uploaded jacket ${jid} photo ${pids[index]} to Google Drive ${fileIds[index]}`));
            await client.query(queueDeleteQuery, [HOOTSUITE_QID, jid]);
            await client.query('COMMIT');
            console.log(`${Date()} processed ${jid}`);
        }
        catch (err) {
            console.error(err);
            await client.query('ROLLBACK');
            break;
        }
        finally {
            client.release();
        }
    }
    await db.end();

}).catch((err) => {
    console.error(err);
});
