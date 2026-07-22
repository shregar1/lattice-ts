"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHeaderConstant = void 0;
const abstraction_1 = require("./abstraction");
class HttpHeaderConstant extends abstraction_1.ModuleBaseConstant {
    static X_REQUEST_ID = 'x-request-id';
    static X_CORRELATION_ID = 'x-correlation-id';
    static X_TENANT_ID = 'x-tenant-id';
    static AUTHORIZATION = 'authorization';
    static CONTENT_TYPE = 'content-type';
}
exports.HttpHeaderConstant = HttpHeaderConstant;
