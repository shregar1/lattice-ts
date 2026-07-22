"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const abstraction_1 = require("./abstraction");
class BadRequestException extends abstraction_1.BaseException {
    statusCode = 400;
    constructor(message = 'Bad request syntax or payload', code = 'BAD_REQUEST', errors, details) {
        super(message, code, errors, details);
    }
}
exports.BadRequestException = BadRequestException;
