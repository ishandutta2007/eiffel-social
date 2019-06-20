const qids = {
  'hootsuite': 1,
  'google': 2,
  'arcgis': 3,
};

module.exports = function(db) {

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

    const putParticipants = async (jid, participants) => {
        return { status: 'failed', message: 'Not implemented' };
    };

    return {
        getQueue: getQueue,
        getQueueItem: getQueueItem,
        getParticipants: getParticipants,
        putParticipants: putParticipants,
    };

};
