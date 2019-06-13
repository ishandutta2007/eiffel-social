const express = require('express');

module.exports = function AuthRouter(authController) {

    const router = express.Router();

    router.get('/:provider', (req, res, next) => {
        authController.getOauthAuthorizeUrl(req.params.provider, req.query.uid)
            .then((url) => { res.redirect(url); })
            .catch(next);
    });

    router.get('/:provider/callback', (req, res, next) => {
        authController.getOauthAccessToken(req.params.provider, req.query)
            .then((tokenData) => { res.status(200).send(tokenData); })
            .catch(next);
    });

    router.get('/:provider/token', (req, res, next) => {
        authController.getOauthData(req.params.provider)
            .then((tokenData) => { res.status(200).send(tokenData); })
            .catch(next);
    });

    return router;

};
