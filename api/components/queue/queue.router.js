const express = require('express');

module.exports = function QueueRouter(queueController) {

    const router = express.Router();

    router.get('/google/participants', (req, res, next) => {
        queueController.getParticipants()
            .then((participants) => { res.status(200).send(participants); })
            .catch(next);
    });

    router.put('/google/:jid/participants', (req, res, next) => {
        queueController.putParticipants(req.params.jid, req.body)
            .then((result) => { res.status(200).send(result); })
            .catch(next);
    });

    router.get('/:provider', (req, res, next) => {
        queueController.getQueue(req.params.provider)
            .then((jackets) => { res.status(200).send(jackets); })
            .catch(next);
    });

    router.get('/:provider/:jid', (req, res, next) => {
        queueController.getQueueItem(req.params.provider, req.params.jid)
            .then((jacket) => { res.status(200).send(jacket); })
            .catch(next);
    });

    return router;

};
