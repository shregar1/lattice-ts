"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
class BaseException extends Error {
    code;
    errors;
    details;
    constructor(message, code = 'INTERNAL_ERROR', errors, details) {
        super(message);
        this.code = code;
        this.errors = errors;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseException = BaseException;
