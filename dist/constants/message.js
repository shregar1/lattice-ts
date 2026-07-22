"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConstant = void 0;
const abstraction_1 = require("./abstraction");
class MessageConstant extends abstraction_1.ModuleBaseConstant {
    static USER_REGISTERED_SUCCESSFULLY = 'User registered successfully';
    static USER_AUTHENTICATED_SUCCESSFULLY = 'User authenticated successfully';
    static OPERATION_COMPLETED_SUCCESSFULLY = 'Operation completed successfully';
    static SERVICE_IS_HEALTHY = 'Service is healthy';
    static INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password';
    static USER_ALREADY_EXISTS = 'User with this email already exists';
    static RESOURCE_NOT_FOUND = 'Resource not found';
    static INTERNAL_SERVER_ERROR = 'Internal server error';
}
exports.MessageConstant = MessageConstant;
