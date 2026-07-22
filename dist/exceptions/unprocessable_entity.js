"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityException = void 0;
const abstraction_1 = require("./abstraction");
class UnprocessableEntityException extends abstraction_1.BaseException {
    statusCode = 422;
    constructor(message = 'Unprocessable entity payload', code = 'UNPROCESSABLE_ENTITY', errors, details) {
        super(message, code, errors, details);
    }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
