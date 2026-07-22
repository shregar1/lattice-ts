"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionFailureException = exports.ConstraintViolationException = exports.DatabaseTimeoutException = exports.ConcurrencyConflictException = exports.DuplicateKeyException = exports.EntityNotFoundException = void 0;
const abstraction_1 = require("./abstraction");
class EntityNotFoundException extends abstraction_1.BaseException {
    statusCode = 404;
    constructor(message = 'Requested entity not found') {
        super(message);
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class DuplicateKeyException extends abstraction_1.BaseException {
    statusCode = 409;
    constructor(message = 'Entity with unique identifier already exists') {
        super(message);
    }
}
exports.DuplicateKeyException = DuplicateKeyException;
class ConcurrencyConflictException extends abstraction_1.BaseException {
    statusCode = 409;
    constructor(message = 'Optimistic locking concurrency conflict detected') {
        super(message);
    }
}
exports.ConcurrencyConflictException = ConcurrencyConflictException;
class DatabaseTimeoutException extends abstraction_1.BaseException {
    statusCode = 504;
    constructor(message = 'Database operation timed out') {
        super(message);
    }
}
exports.DatabaseTimeoutException = DatabaseTimeoutException;
class ConstraintViolationException extends abstraction_1.BaseException {
    statusCode = 400;
    constructor(message = 'Database constraint violation') {
        super(message);
    }
}
exports.ConstraintViolationException = ConstraintViolationException;
class ConnectionFailureException extends abstraction_1.BaseException {
    statusCode = 503;
    constructor(message = 'Failed to establish database connection') {
        super(message);
    }
}
exports.ConnectionFailureException = ConnectionFailureException;
