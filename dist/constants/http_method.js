"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethodConstant = void 0;
const abstraction_1 = require("./abstraction");
class HttpMethodConstant extends abstraction_1.ModuleBaseConstant {
    static GET = 'GET';
    static POST = 'POST';
    static PUT = 'PUT';
    static PATCH = 'PATCH';
    static DELETE = 'DELETE';
    static OPTIONS = 'OPTIONS';
    static HEAD = 'HEAD';
}
exports.HttpMethodConstant = HttpMethodConstant;
