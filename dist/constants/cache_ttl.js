"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTtlConstant = void 0;
const abstraction_1 = require("./abstraction");
class CacheTtlConstant extends abstraction_1.ModuleBaseConstant {
    static FIVE_SECONDS = 5;
    static ONE_MINUTE = 60;
    static FIVE_MINUTES = 300;
    static FIFTEEN_MINUTES = 900;
    static ONE_HOUR = 3600;
    static ONE_DAY = 86400;
}
exports.CacheTtlConstant = CacheTtlConstant;
