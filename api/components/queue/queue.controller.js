module.exports = function(queueService) {

    const getQueue = async (provider) => {
        const jackets = queueService.getQueue(provider);
        return jackets;
    };

    const getQueueItem = async (provider, jid) => {
        const jacket = queueService.getQueueItem(provider, jid);
        return jacket;
    };

    const getParticipants = async () => {
        const participants = queueService.getParticipants();
        return participants;
    }

    const putParticipants = async (jid, participants) => {
        const status = queueService.putParticipants(jid, participants);
        return { status: status };
    }

    return {
        getQueue: getQueue,
        getQueueItem: getQueueItem,
        getParticipants: getParticipants,
        putParticipants: putParticipants,
    };

};
