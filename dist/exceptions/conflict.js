"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = void 0;
const abstraction_1 = require("./abstraction");
class ConflictException extends abstraction_1.BaseException {
    statusCode = 409;
    constructor(message = 'Resource state conflict occurred', code = 'CONFLICT', errors, details) {
        super(message, code, errors, details);
    }
}
exports.ConflictException = ConflictException;
