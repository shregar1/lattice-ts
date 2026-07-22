"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationMiddleware = void 0;
const abstraction_1 = require("./abstraction");
const forbidden_1 = require("../exceptions/forbidden");
class AuthorizationMiddleware extends abstraction_1.ModuleBaseMiddleware {
    requiredRoles;
    requiredPermissions;
    constructor(requiredRoles = [], requiredPermissions = []) {
        super();
        this.requiredRoles = requiredRoles;
        this.requiredPermissions = requiredPermissions;
    }
    async handle(req, next) {
        const userRoles = req.context?.roles || [];
        const userPermissions = req.context?.permissions || [];
        if (this.requiredRoles.length > 0) {
            const hasRole = this.requiredRoles.some((role) => userRoles.includes(role));
            if (!hasRole) {
                throw new forbidden_1.ForbiddenException('Insufficient role privileges', 'INSUFFICIENT_ROLE');
            }
        }
        if (this.requiredPermissions.length > 0) {
            const hasPermission = this.requiredPermissions.some((perm) => userPermissions.includes(perm));
            if (!hasPermission) {
                throw new forbidden_1.ForbiddenException('Insufficient permissions', 'INSUFFICIENT_PERMISSION');
            }
        }
        return await next();
    }
}
exports.AuthorizationMiddleware = AuthorizationMiddleware;
