module.exports = (db) => {

    const AuthService = require('./auth.service.js');
    const AuthController = require('./auth.controller.js');
    const AuthRouter = require('./auth.router.js');

    const authService = new AuthService(db);
    const authController = new AuthController(authService);
    const authRouter = new AuthRouter(authController);

    return authRouter;

};
