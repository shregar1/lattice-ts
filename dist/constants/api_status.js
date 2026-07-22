"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStatusConstant = void 0;
const abstraction_1 = require("./abstraction");
class ApiStatusConstant extends abstraction_1.ModuleBaseConstant {
    static SUCCESS = 'SUCCESS';
    static FAILURE = 'FAILURE';
    static PENDING = 'PENDING';
}
exports.ApiStatusConstant = ApiStatusConstant;
