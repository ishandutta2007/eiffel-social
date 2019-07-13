const express = require('express');

module.exports = function QueueRouter(queueController) {

    const router = express.Router();

    router.get('/arcgis/:jid/hasPhotos', (req, res, next) => {
        queueController.hasPhotos(req.params.jid)
            .then((answer) => { res.status(200).send(answer); })
            .catch(next);
    });

    router.get('/arcgis/:jid/photo', (req, res, next) => {
        queueController.getPhotos(req.params.jid, res)
            .then(() => { /* archiver streams to res */ })
            .catch(next);
    });

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

    router.delete('/:provider/:jid', (req, res, next) => {
        queueController.deleteQueueItem(req.params.provider, req.params.jid)
            .then(() => { res.status(200).send({ status: 'OK' }); })
            .catch(next);
    });

    return router;

};
