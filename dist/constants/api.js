"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEndpointsConstant = void 0;
const abstraction_1 = require("./abstraction");
class ApiEndpointsConstant extends abstraction_1.ModuleBaseConstant {
    static AUTH_REGISTER = '/api/v1/auth/register';
    static AUTH_LOGIN = '/api/v1/auth/login';
    static USER_PROFILE = '/api/v1/user/profile';
    static FILE_UPLOAD = '/api/v1/file/upload';
    static HEALTH_CHECK = '/api/v1/health';
}
exports.ApiEndpointsConstant = ApiEndpointsConstant;
