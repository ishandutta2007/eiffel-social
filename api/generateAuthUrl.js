const fail = (message) => {
   console.error(message);
   process.exit(1);
};

const DOMAIN = process.env.DOMAIN;

if (process.argv.length < 4) { fail('Please enter a UID and provider.'); }
const uid = Number(process.argv[2]);
if (!uid) { fail('Please enter a numeric UID.'); }
const provider = process.argv[3];
const config = require('./components/auth/config.json');
if (!(provider in config)) { fail(`Unknown provider ${provider}.`); }

const initDb = require('./lib/initDb.js')(console);
initDb.then(async (db) => {

    const commonService = require('./components/common/common.service.js')(db);
    const payload = {
        uid: uid,
        time: Date.now(),
        path: `/auth/${provider}`,
    };
    const hmac = await commonService.generateSignature(payload, payload.uid);

    console.log(`Log into ${DOMAIN}, then copy and paste the URL below into your browser.`);
    console.log(`https://${DOMAIN}/api${payload.path}?uid=${payload.uid}&time=${payload.time}&hmac=${encodeURIComponent(hmac)}`);

    await db.end();

}).catch((err) => {
    console.error(err);
});
