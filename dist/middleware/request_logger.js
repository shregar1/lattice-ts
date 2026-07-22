"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const abstraction_1 = require("./abstraction");
class RequestLoggerMiddleware extends abstraction_1.ModuleBaseMiddleware {
    logger;
    constructor(logger) {
        super();
        this.logger = logger;
    }
    async handle(req, next) {
        const response = await next();
        const ctx = req.context;
        const latencyMs = ctx ? Date.now() - ctx.startTime : 0;
        this.logger.info(`HTTP ${ctx?.method || 'GET'} ${ctx?.path || '/'} - ${response.statusCode} (${latencyMs}ms)`, {
            requestUrn: ctx?.requestUrn,
            referenceUrn: ctx?.referenceUrn,
            correlationId: ctx?.correlationId,
            method: ctx?.method,
            path: ctx?.path,
            statusCode: response.statusCode,
            latencyMs,
            clientIp: ctx?.clientIp,
            userId: ctx?.userId,
            tenantId: ctx?.tenantId,
        });
        return response;
    }
}
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
