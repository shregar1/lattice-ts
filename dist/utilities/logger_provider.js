"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
class StructuredLogger {
    defaultServiceName;
    constructor(defaultServiceName = 'BackendService') {
        this.defaultServiceName = defaultServiceName;
    }
    info(message, context) {
        this.log('INFO', message, context);
    }
    warn(message, context) {
        this.log('WARN', message, context);
    }
    error(message, error, context) {
        this.log('ERROR', message, { ...context, errorDetails: error?.message || error });
    }
    debug(message, context) {
        this.log('DEBUG', message, context);
    }
    log(level, message, context) {
        const logPayload = {
            timestamp: new Date().toISOString(),
            level,
            serviceName: context?.serviceName || this.defaultServiceName,
            requestId: context?.requestId || 'N/A',
            correlationId: context?.correlationId || 'N/A',
            message,
            metadata: context ? { ...context } : {},
        };
        console.log(JSON.stringify(logPayload));
    }
}
exports.StructuredLogger = StructuredLogger;
