const express = require('express');
const bodyParser = require('body-parser');

module.exports = function CommonRouter(commonController, logger) {

    const router = express.Router();

    // Parse HTTP request bodies as JSON
    router.use(bodyParser.json({ limit: '10mb', strict: false }));

    // Log all requests, and forward them to the next middleware function
    router.use((req, res, next) => {
        logger.info(`${req.method} ${req.url}`);
        next();
    });

    // Check for a valid HMAC signature on all requests, then forward on
    router.use((req, res, next) => {
        let verifier;
        if (req.path === '/token/verify') {
            verifier = commonController.verifyEmail;
        }
        else {
            verifier = commonController.verifySignature;
        }
        let query;
        if (req.path.startsWith('/auth/') && req.path.endsWith('/callback')) {
            const state = req.query.state;
            query = state ? JSON.parse(Buffer.from(state, 'base64').toString('utf8')) : {};
        }
        else {
            query = req.query;
        }
        verifier(req.path, query, req.body)
            .then(() => { next(); })  // everything's OK: move on to the next handler
            .catch(next);             // pass any exception to the error handler
    });

    return router;

};
