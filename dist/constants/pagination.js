"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationConstant = void 0;
const abstraction_1 = require("./abstraction");
class PaginationConstant extends abstraction_1.ModuleBaseConstant {
    static DEFAULT_PAGE = 1;
    static DEFAULT_LIMIT = 20;
    static MAX_LIMIT = 100;
    static DEFAULT_SORT_ORDER = 'DESC';
}
exports.PaginationConstant = PaginationConstant;
