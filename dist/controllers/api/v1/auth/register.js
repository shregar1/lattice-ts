"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterController = void 0;
const controller_1 = require("../../../../abstractions/controller");
const message_1 = require("../../../../constants/message");
class RegisterController extends controller_1.BaseController {
    authOrchestrator;
    constructor(authOrchestrator) {
        super();
        this.authOrchestrator = authOrchestrator;
    }
    async handle(req) {
        const { email, password, firstName, lastName } = req.body;
        const result = await this.authOrchestrator.register({
            email,
            password,
            firstName,
            lastName,
            context: req.context,
        });
        return this.created(result, message_1.MessageConstant.USER_REGISTERED_SUCCESSFULLY, 'USER_REGISTERED', req.context);
    }
}
exports.RegisterController = RegisterController;
