"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
const abstraction_1 = require("./abstraction");
class StructuredLogger extends abstraction_1.ModuleBaseUtility {
    serviceName;
    constructor(serviceName = 'BackendService') {
        super();
        this.serviceName = serviceName;
    }
    info(message, meta) {
        console.log(this.formatLog('INFO', message, meta));
    }
    warn(message, meta) {
        console.warn(this.formatLog('WARN', message, meta));
    }
    error(message, error, meta) {
        console.error(this.formatLog('ERROR', message, { ...meta, error: error?.message || error }));
    }
    debug(message, meta) {
        console.debug(this.formatLog('DEBUG', message, meta));
    }
    formatLog(level, message, meta) {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            level,
            serviceName: this.serviceName,
            requestId: meta?.requestId || meta?.requestUrn || 'N/A',
            correlationId: meta?.correlationId || 'N/A',
            message,
            metadata: meta || {},
        });
    }
}
exports.StructuredLogger = StructuredLogger;
