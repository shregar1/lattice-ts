"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = void 0;
const abstraction_1 = require("./abstraction");
class ForbiddenException extends abstraction_1.BaseException {
    statusCode = 403;
    constructor(message = 'Access to this resource is forbidden', code = 'FORBIDDEN', errors, details) {
        super(message, code, errors, details);
    }
}
exports.ForbiddenException = ForbiddenException;
