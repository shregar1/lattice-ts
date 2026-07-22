"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = void 0;
const abstraction_1 = require("./abstraction");
class InternalServerException extends abstraction_1.BaseException {
    statusCode = 500;
    constructor(message = 'Internal server error occurred', code = 'INTERNAL_SERVER_ERROR', errors, details) {
        super(message, code, errors, details);
    }
}
exports.InternalServerException = InternalServerException;
