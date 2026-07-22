"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditMiddleware = void 0;
const abstraction_1 = require("./abstraction");
class AuditMiddleware extends abstraction_1.ModuleBaseMiddleware {
    logger;
    constructor(logger) {
        super();
        this.logger = logger;
    }
    async handle(req, next) {
        const response = await next();
        const isMutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.context?.method || '');
        if (isMutatingMethod && response.success) {
            setTimeout(() => {
                this.logger.info(`AUDIT: Action '${req.context?.method} ${req.context?.path}' executed by user '${req.context?.userId || 'ANONYMOUS'}'`, {
                    requestUrn: req.context?.requestUrn,
                    referenceUrn: req.context?.referenceUrn,
                    userId: req.context?.userId,
                    tenantId: req.context?.tenantId,
                    path: req.context?.path,
                    method: req.context?.method,
                });
            }, 0);
        }
        return response;
    }
}
exports.AuditMiddleware = AuditMiddleware;
