"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcurrencyConflictException = void 0;
const abstraction_1 = require("./abstraction");
class ConcurrencyConflictException extends abstraction_1.BaseException {
    statusCode = 409;
    constructor(message = 'Optimistic locking concurrency conflict detected') {
        super(message);
    }
}
exports.ConcurrencyConflictException = ConcurrencyConflictException;
