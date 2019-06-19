module.exports = function(queueService) {

    const getQueue = async (provider) => {
        const jackets = queueService.getQueue(provider);
        return jackets;
    };

    return {
        getQueue: getQueue,
    };

};
