// Fetch new jackets, and add them to the queues.

const jacketsSelectQuery = 'select j.jid from jackets j left join seen_jackets sj on j.jid=sj.jid where sj.seen is null and j.seeAlso is null and j.created > $1';
const jacketsInsertQuery = 'insert into seen_jackets (jid, seen) select * from unnest ($1::int4[], $2::int8[])';
const queueInsertQuery = 'insert into queue_items (qid, jid) select * from unnest ($1::int4[], $2::int4[])';
const sixMonths = 182 * 86400 * 1000;
const qids = {
  'hootsuite': 1,
  'google': 2,
  'arcgis': 3,
};
const fetchUnseen = async (db) => {
  const now = Date.now();
  const sixMonthsAgo = now - sixMonths;
  const jacketsSelectResult = await db.query(jacketsSelectQuery, [sixMonthsAgo]);
  if (!jacketsSelectResult.rows.length) { return []; }
  const jids = jacketsSelectResult.rows.map((row) => row.jid);
  await db.query(jacketsInsertQuery, [jids, Array(jids.length).fill(now)]);
  Object.values(qids).forEach(async (qid) => await db.query(queueInsertQuery, [Array(jids.length).fill(qid), jids]));
  return jids;
};

const initDb = require('./lib/initDb.js')(console);
initDb.then(async (db) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const jids = await fetchUnseen(client);
        await client.query('COMMIT');
        console.log(`${Date()} Fetched ${jids.length} jackets:`, jids);
    }
    catch (err) {
        console.error(err);
        await client.query('ROLLBACK');
        return;
    }
    finally {
        client.release();
        await db.end();
    }
}).catch((err) => {
    console.error(err);
});
