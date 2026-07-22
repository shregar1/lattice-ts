"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutException = void 0;
const abstraction_1 = require("./abstraction");
class TimeoutException extends abstraction_1.BaseException {
    statusCode = 504;
    constructor(message = 'Gateway request timed out', code = 'REQUEST_TIMEOUT', errors, details) {
        super(message, code, errors, details);
    }
}
exports.TimeoutException = TimeoutException;
