"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionHandlerMiddleware = exports.RequestContextMiddleware = void 0;
const base_exception_1 = require("../exceptions/base.exception");
const base_envelope_1 = require("../dto/controller/responses/base_envelope");
class RequestContextMiddleware {
    static async handle(req, next) {
        req.context = {
            requestId: (req.headers && req.headers['x-request-id']) || `tx_${Date.now()}`,
            correlationId: (req.headers && req.headers['x-correlation-id']) || `ref_${Date.now()}`,
            timestamp: new Date().toISOString(),
            ip: (req.headers && req.headers['x-forwarded-for']) || '127.0.0.1',
            userAgent: (req.headers && req.headers['user-agent']) || 'unknown',
        };
        return await next();
    }
}
exports.RequestContextMiddleware = RequestContextMiddleware;
class ExceptionHandlerMiddleware {
    static async handle(req, next) {
        try {
            return await next();
        }
        catch (error) {
            if (error instanceof base_exception_1.BaseException) {
                const errorEnvelope = new base_envelope_1.BaseResponseEnvelopeDto({
                    transactionUrn: req.context?.requestId || '',
                    status: 'FAILED',
                    responseMessage: error.message,
                    responseKey: error.code,
                    errors: error.errors || [error.message],
                    timestamp: new Date().toISOString(),
                    metadata: {},
                    data: null,
                    referenceUrn: req.context?.correlationId || '',
                });
                return {
                    statusCode: error.statusCode,
                    success: false,
                    message: error.message,
                    data: errorEnvelope,
                };
            }
            const defaultErrorEnvelope = new base_envelope_1.BaseResponseEnvelopeDto({
                transactionUrn: req.context?.requestId || '',
                status: 'FAILED',
                responseMessage: 'Internal server error',
                responseKey: 'INTERNAL_SERVER_ERROR',
                errors: [error.message || 'Unknown error occurred'],
                timestamp: new Date().toISOString(),
                metadata: {},
                data: null,
                referenceUrn: req.context?.correlationId || '',
            });
            return {
                statusCode: 500,
                success: false,
                message: 'Internal server error',
                data: defaultErrorEnvelope,
            };
        }
    }
}
exports.ExceptionHandlerMiddleware = ExceptionHandlerMiddleware;
