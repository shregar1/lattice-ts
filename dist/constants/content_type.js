"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTypeConstant = void 0;
const abstraction_1 = require("./abstraction");
class ContentTypeConstant extends abstraction_1.ModuleBaseConstant {
    static APPLICATION_JSON = 'application/json';
    static MULTIPART_FORM_DATA = 'multipart/form-data';
    static APPLICATION_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
    static TEXT_PLAIN = 'text/plain';
    static TEXT_HTML = 'text/html';
    static APPLICATION_OCTET_STREAM = 'application/octet-stream';
    static APPLICATION_PDF = 'application/pdf';
}
exports.ContentTypeConstant = ContentTypeConstant;
