const HOOTSUITE_QID = 1;

const queueSelectQuery = 'select jid from queue_items where qid=$1 limit 1';
const queueDeleteQuery = 'delete from queue_items where qid=$1 and jid=$2';
const photosSelectQuery = 'select pid from photos where jid=$1';
const photoSelectQuery = 'select image from photos where jid=$1 and pid=$2';

const getQueueJid = async (db) => {
    const queueSelectResult = await db.query(queueSelectQuery, [HOOTSUITE_QID]);
    if (!queueSelectResult.rows.length) { return false; }
    return queueSelectResult.rows[0].jid;
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
        image: Buffer.from(imageDataUri.slice(match[0].length), 'base64'),
    };
};

const got = require('got');
const AuthService = require('./components/auth/auth.service.js');
const getUploadUrlUrl = 'https://platform.hootsuite.com/v1/media';
const processPhoto = async (jid, pid, db) => {
    // get image data and MIME type
    const photo = getPhoto(jid, pid, db);
    // get oAuth2 access token
    const { getOauthData } = AuthService(db);
    const { accessToken, expiry } = await getOauthData('hootsuite');
    if (expiry < Date.now()) { throw { message: 'could not get fresh access token' }; }
    // get upload URL
    const mediaData = {
        mimeType: photo.type,
        sizeBytes: photo.image.length,
    };
    const mediaResponse = await got.post(getUploadUrlUrl, {
        body: mediaData,
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true,
    }).body;
    const uploadUrl = mediaResponse.data.uploadUrl;
    // PUT photo data to AWS
    await got.put(uploadUrl, {
        body: photo.image,
        headers: { 'Content-Type': photo.type },
    });
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
            pids.forEach(async (pid) => await processPhoto(jid, pid, client));
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
