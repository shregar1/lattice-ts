"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = void 0;
const abstraction_1 = require("./abstraction");
class UnauthorizedException extends abstraction_1.BaseException {
    statusCode = 403;
    constructor(message = 'Permission denied for this resource', code = 'UNAUTHORIZED', errors, details) {
        super(message, code, errors, details);
    }
}
exports.UnauthorizedException = UnauthorizedException;
