"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseKeyConstant = void 0;
const abstraction_1 = require("./abstraction");
class ResponseKeyConstant extends abstraction_1.ModuleBaseConstant {
    static SUCCESS = 'SUCCESS';
    static RESOURCE_CREATED = 'RESOURCE_CREATED';
    static USER_REGISTERED = 'USER_REGISTERED';
    static AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
    static VALIDATION_ERROR = 'VALIDATION_ERROR';
    static UNAUTHORIZED = 'UNAUTHORIZED';
    static FORBIDDEN = 'FORBIDDEN';
    static NOT_FOUND = 'NOT_FOUND';
    static CONFLICT = 'CONFLICT';
    static INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
}
exports.ResponseKeyConstant = ResponseKeyConstant;
