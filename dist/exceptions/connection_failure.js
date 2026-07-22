"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionFailureException = void 0;
const abstraction_1 = require("./abstraction");
class ConnectionFailureException extends abstraction_1.BaseException {
    statusCode = 503;
    constructor(message = 'Failed to establish database connection') {
        super(message);
    }
}
exports.ConnectionFailureException = ConnectionFailureException;
