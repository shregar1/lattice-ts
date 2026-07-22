"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateKeyException = void 0;
const abstraction_1 = require("./abstraction");
class DuplicateKeyException extends abstraction_1.BaseException {
    statusCode = 409;
    constructor(message = 'Entity with unique identifier already exists') {
        super(message);
    }
}
exports.DuplicateKeyException = DuplicateKeyException;
