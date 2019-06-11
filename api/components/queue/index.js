module.exports = (db) => {

    const QueueService = require('./queue.service.js');
    const QueueController = require('./queue.controller.js');
    const QueueRouter = require('./queue.router.js');

    const queueService = new QueueService(db);
    const queueController = new QueueController(queueService);
    const queueRouter = new QueueRouter(queueController);

    return queueRouter;

};
