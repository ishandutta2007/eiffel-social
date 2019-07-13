const archiver = require('archiver');

module.exports = function(queueService) {

    const getPhotos = async (jid, res) => {
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', function(err) {
            throw { status: 500, message: err.message };
        });
        res.attachment(`${jid}-photos.zip`);
        archive.pipe(res);
        await queueService.getPhotos(jid, archive);
        await archive.finalize();
        return;
    };

    const getQueue = async (provider) => {
        const jackets = await queueService.getQueue(provider);
        return jackets;
    };

    const getQueueItem = async (provider, jid) => {
        const jacket = await queueService.getQueueItem(provider, jid);
        return jacket;
    };

    const deleteQueueItem = async (provider, jid) => {
        await queueService.deleteQueueItem(provider, jid);
        return;
    };

    const getParticipants = async () => {
        const participants = await queueService.getParticipants();
        return participants;
    };

    const putParticipants = async (jid, participants) => {
        const status = await queueService.putParticipants(jid, participants);
        return status;
    };

    return {
        getPhotos: getPhotos,
        getQueue: getQueue,
        getQueueItem: getQueueItem,
        deleteQueueItem: deleteQueueItem,
        getParticipants: getParticipants,
        putParticipants: putParticipants,
    };

};
