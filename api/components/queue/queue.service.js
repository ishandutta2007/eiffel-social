const GOOGLE_DOMAIN = process.env.GOOGLE_DOMAIN;

const qids = {
  'hootsuite': 1,
  'google': 2,
  'arcgis': 3,
};

module.exports = function(db) {

    const AuthService = require('../auth/auth.service.js');
    const { oauthApiCall } = new AuthService(db);

    const jacketFields = [
        'expedition',
        'jacketNumber',
        'created',
        'locality',
        'specimenType',
    ];
    const jacketFieldsString = jacketFields.map((field) => `j.${field}`).join(', ');

    const jacketsSelectQuery = `select j.jid, ${jacketFieldsString}, u.fullname from queue_items q left join jackets j on j.jid=q.jid left join users u on u.uid=j.juid where q.qid=$1`;
    const getQueue = async (provider) => {
        if (!(provider in qids)) { return []; }
        const qid = qids[provider];
        const jacketsSelectResult = await db.query(jacketsSelectQuery, [qid]);
        return jacketsSelectResult.rows;
    };

    const jacketSelectQuery = `select j.jid, ${jacketFieldsString}, u.fullname, u.email from queue_items q left join jackets j on j.jid=q.jid left join users u on u.uid=j.juid where q.qid=$1 and j.jid=$2`;
    const getQueueItem = async (provider, jid) => {
        if (!(provider in qids)) { return {}; }
        const qid = qids[provider];
        const jacketSelectResult = await db.query(jacketSelectQuery, [qid, jid]);
        if (!jacketSelectResult.rows.length) { return {}; }
        return jacketSelectResult.rows[0];
    };

    const participantsSelectQuery = 'select uid, fullname, email from participants';
    const getParticipants = async () => {
        const participantsSelectResults = await db.query(participantsSelectQuery, []);
        if (!participantsSelectResults.rows.length) { return []; }
        return participantsSelectResults.rows;
    };

    const _normalizeJacketNumber = (number) => {
        // strip all non-alphanumerics except dashes and spaces
        number = number.replace(/[^0-9A-Za-z -]/g, '');
        // convert all spaces to dashes
        return number.replace(/ /g, '-');
    };
    const _createGoogleGroup = async (jid) => {
        const provider = 'google';
        try {
            const jacketSelectResult = await db.query(jacketSelectQuery, [qids[provider], jid]);
            if (!jacketSelectResult.rows.length) { return { status: 'not_found', message: `Jacket ${jid} not found` }; }
            const jacketNumber = jacketSelectResult.rows[0].jacketnumber;
            const email = `${_normalizeJacketNumber(jacketNumber)}@${GOOGLE_DOMAIN}`;
            const groupInsertBody = {
                email: email,
                description: `This is an announcements-only group for information about ${jacketNumber}.`,
                name: jacketNumber,
            };
            const response = await oauthApiCall(provider, 'POST', '/admin/directory/v1/groups', groupInsertBody);
            const gid = response.id;
            return { status: 'ok', email: email, gid: gid };
        }
        catch (err) {
            return { status: 'create_failed', message: `Group creation failed because ${JSON.stringify(err)}.  Try to fix the issue, and try again later.` };
        }
    };
    const putParticipants = async (jid, participants) => {
        const createResponse = await _createGoogleGroup(jid);
        if (createResponse.status !== 'ok') { return createResponse; }
        const { email, gid } = createResponse;
        return { status: 'failed', message: 'Not implemented', remaining_members: ['alice','bob'] };
    };

    return {
        getQueue: getQueue,
        getQueueItem: getQueueItem,
        getParticipants: getParticipants,
        putParticipants: putParticipants,
    };

};
