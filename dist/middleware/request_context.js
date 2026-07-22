"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandlerMiddleware = exports.RequestContextMiddleware = void 0;
const abstraction_1 = require("./abstraction");
const base_envelope_1 = require("../dto/controller/responses/base_envelope");
class RequestContextMiddleware extends abstraction_1.ModuleBaseMiddleware {
    async handle(req, next) {
        const startTime = Date.now();
        // Preserve existing metrics array if attached upstream
        const existingMetrics = req.context?.metrics || [];
        req.context = {
            requestUrn: (req.headers && req.headers['x-request-id']) || `urn:request:${this.generateUuid()}`,
            referenceUrn: `urn:ref:${this.generateUuid()}`,
            correlationId: (req.headers && req.headers['x-correlation-id']) || this.generateUuid(),
            startTime,
            clientIp: req.headers && req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '127.0.0.1',
            userAgent: (req.headers && req.headers['user-agent']) || 'Unknown',
            path: (req.headers && req.headers['path']) || '/',
            method: (req.headers && req.headers['method']) || 'GET',
            userId: undefined,
            tenantId: req.headers && req.headers['x-tenant-id'],
            metrics: existingMetrics,
        };
        return await next();
    }
    generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
exports.RequestContextMiddleware = RequestContextMiddleware;
class ExceptionHandlerMiddleware extends abstraction_1.ModuleBaseMiddleware {
    async handle(req, next) {
        try {
            return await next();
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            const responseKey = error.responseKey || 'INTERNAL_SERVER_ERROR';
            const message = error.message || 'An unexpected error occurred';
            const errors = error.errors || [message];
            const envelope = new base_envelope_1.BaseResponseEnvelopeDTO({
                transactionUrn: req.context?.requestUrn || '',
                status: 'FAILED',
                responseMessage: message,
                responseKey,
                errors,
                timestamp: new Date().toISOString(),
                metadata: {},
                data: null,
                referenceUrn: req.context?.referenceUrn || '',
            });
            return {
                statusCode,
                success: false,
                message,
                data: envelope,
            };
        }
    }
}
exports.ExceptionHandlerMiddleware = ExceptionHandlerMiddleware;
