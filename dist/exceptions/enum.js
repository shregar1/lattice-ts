"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const not_found_1 = require("./not_found");
const unprocessable_entity_1 = require("./unprocessable_entity");
const unauthenticated_1 = require("./unauthenticated");
const unauthorized_1 = require("./unauthorized");
const bad_request_1 = require("./bad_request");
const conflict_1 = require("./conflict");
const forbidden_1 = require("./forbidden");
const internal_server_1 = require("./internal_server");
const timeout_1 = require("./timeout");
class Exception {
    static NotFound(message, code, errors, details) {
        return { kind: 'NotFound', exception: new not_found_1.NotFoundException(message, code, errors, details) };
    }
    static UnprocessableEntity(message, code, errors, details) {
        return { kind: 'UnprocessableEntity', exception: new unprocessable_entity_1.UnprocessableEntityException(message, code, errors, details) };
    }
    static Unauthenticated(message, code, errors, details) {
        return { kind: 'Unauthenticated', exception: new unauthenticated_1.UnauthenticatedException(message, code, errors, details) };
    }
    static Unauthorized(message, code, errors, details) {
        return { kind: 'Unauthorized', exception: new unauthorized_1.UnauthorizedException(message, code, errors, details) };
    }
    static BadRequest(message, code, errors, details) {
        return { kind: 'BadRequest', exception: new bad_request_1.BadRequestException(message, code, errors, details) };
    }
    static Conflict(message, code, errors, details) {
        return { kind: 'Conflict', exception: new conflict_1.ConflictException(message, code, errors, details) };
    }
    static Forbidden(message, code, errors, details) {
        return { kind: 'Forbidden', exception: new forbidden_1.ForbiddenException(message, code, errors, details) };
    }
    static InternalServer(message, code, errors, details) {
        return { kind: 'InternalServer', exception: new internal_server_1.InternalServerException(message, code, errors, details) };
    }
    static Timeout(message, code, errors, details) {
        return { kind: 'Timeout', exception: new timeout_1.TimeoutException(message, code, errors, details) };
    }
    static match(variant, matchers) {
        const handler = matchers[variant.kind] || matchers._;
        if (!handler) {
            throw new Error(`Unhandled Exception variant '${variant.kind}' in pattern match`);
        }
        return handler(variant.exception);
    }
}
exports.Exception = Exception;
