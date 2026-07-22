"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMapper = void 0;
const abstraction_1 = require("./abstraction");
class BaseMapper extends abstraction_1.ModuleBaseUtility {
    mapArray(sources) {
        return sources.map((s) => this.map(s));
    }
}
exports.BaseMapper = BaseMapper;
