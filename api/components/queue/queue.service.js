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

    return {
        getQueue: getQueue,
    };

};
