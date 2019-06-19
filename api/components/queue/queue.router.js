const express = require('express');

module.exports = function QueueRouter(queueController) {

    const router = express.Router();

    router.get('/:provider', (req, res, next) => {
        queueController.getQueue(req.params.provider)
            .then((jackets) => { res.status(200).send(jackets); })
            .catch(next);
    });

    return router;

};
