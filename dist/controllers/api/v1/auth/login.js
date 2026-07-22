"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const abstraction_1 = require("../../../abstraction");
const message_1 = require("../../../../constants/message");
const response_key_1 = require("../../../../constants/response_key");
class LoginController extends abstraction_1.ModuleBaseController {
    authOrchestrator;
    constructor(authOrchestrator) {
        super();
        this.authOrchestrator = authOrchestrator;
    }
    async handle(req) {
        const result = await this.authOrchestrator.login(req.body);
        return this.success(result, message_1.MessageConstant.USER_AUTHENTICATED_SUCCESSFULLY, response_key_1.ResponseKeyConstant.AUTHENTICATION_SUCCESS, req.context);
    }
}
exports.LoginController = LoginController;
