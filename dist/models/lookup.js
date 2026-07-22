"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.LookupModel = void 0;
const model_1 = require("../abstractions/model");
class LookupModel extends model_1.BaseModel {
    id;
    code;
    name;
    description;
    isActive;
    constructor(data) {
        super();
        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.description = data.description;
        this.isActive = data.isActive ?? true;
    }
}
exports.LookupModel = LookupModel;
class RoleModel extends LookupModel {
}
exports.RoleModel = RoleModel;
