"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantResolutionMiddleware = void 0;
const abstraction_1 = require("./abstraction");
class TenantResolutionMiddleware extends abstraction_1.ModuleBaseMiddleware {
    async handle(req, next) {
        const headers = req.headers || {};
        const tenantIdHeader = headers['x-tenant-id'] || req.context?.tenantId;
        if (tenantIdHeader) {
            if (req.context) {
                req.context.tenantId = tenantIdHeader;
            }
        }
        return await next();
    }
}
exports.TenantResolutionMiddleware = TenantResolutionMiddleware;
