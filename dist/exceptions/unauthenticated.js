"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedException = void 0;
const abstraction_1 = require("./abstraction");
class UnauthenticatedException extends abstraction_1.BaseException {
    statusCode = 401;
    constructor(message = 'User authentication required', code = 'UNAUTHENTICATED', errors, details) {
        super(message, code, errors, details);
    }
}
exports.UnauthenticatedException = UnauthenticatedException;
