"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTimeoutException = void 0;
const abstraction_1 = require("./abstraction");
class DatabaseTimeoutException extends abstraction_1.BaseException {
    statusCode = 504;
    constructor(message = 'Database operation timed out') {
        super(message);
    }
}
exports.DatabaseTimeoutException = DatabaseTimeoutException;
