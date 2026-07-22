"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.NotFoundException = exports.BaseException = void 0;
class BaseException extends Error {
    code;
    errors;
    constructor(message, code = 'INTERNAL_SERVER_ERROR', errors) {
        super(message);
        this.code = code;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BaseException = BaseException;
class NotFoundException extends BaseException {
    statusCode = 404;
    constructor(message = 'Resource not found', code = 'NOT_FOUND', errors) {
        super(message, code, errors);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends BaseException {
    statusCode = 400;
    constructor(message = 'Bad request', code = 'BAD_REQUEST', errors) {
        super(message, code, errors);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends BaseException {
    statusCode = 401;
    constructor(message = 'Unauthorized access', code = 'UNAUTHORIZED', errors) {
        super(message, code, errors);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends BaseException {
    statusCode = 403;
    constructor(message = 'Forbidden access', code = 'FORBIDDEN', errors) {
        super(message, code, errors);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends BaseException {
    statusCode = 409;
    constructor(message = 'Resource conflict', code = 'CONFLICT', errors) {
        super(message, code, errors);
    }
}
exports.ConflictException = ConflictException;
class InternalServerException extends BaseException {
    statusCode = 500;
    constructor(message = 'Internal server error', code = 'INTERNAL_ERROR', errors) {
        super(message, code, errors);
    }
}
exports.InternalServerException = InternalServerException;
