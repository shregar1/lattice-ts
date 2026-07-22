"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstraintViolationException = void 0;
const abstraction_1 = require("./abstraction");
class ConstraintViolationException extends abstraction_1.BaseException {
    statusCode = 400;
    constructor(message = 'Database constraint violation') {
        super(message);
    }
}
exports.ConstraintViolationException = ConstraintViolationException;
