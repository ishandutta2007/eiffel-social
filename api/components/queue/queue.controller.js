module.exports = function(queueService) {

    const getQueue = async (provider) => {
        const jackets = await queueService.getQueue(provider);
        return jackets;
    };

    const getQueueItem = async (provider, jid) => {
        const jacket = await queueService.getQueueItem(provider, jid);
        return jacket;
    };

    const getParticipants = async () => {
        const participants = await queueService.getParticipants();
        return participants;
    }

    const putParticipants = async (jid, participants) => {
        const status = await queueService.putParticipants(jid, participants);
        return status;
    }

    return {
        getQueue: getQueue,
        getQueueItem: getQueueItem,
        getParticipants: getParticipants,
        putParticipants: putParticipants,
    };

};
