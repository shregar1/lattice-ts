"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesConstant = void 0;
const abstraction_1 = require("./abstraction");
class TablesConstant extends abstraction_1.ModuleBaseConstant {
    static USERS = 'users';
    static ROLES = 'roles';
    static USER_ROLES = 'user_roles';
    static FILES = 'files';
    static AUDIT_LOGS = 'audit_logs';
    static SESSIONS = 'sessions';
}
exports.TablesConstant = TablesConstant;
