"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionMiddleware = void 0;
const abstraction_1 = require("./abstraction");
class CompressionMiddleware extends abstraction_1.ModuleBaseMiddleware {
    thresholdBytes;
    constructor(thresholdBytes = 1024) {
        super();
        this.thresholdBytes = thresholdBytes;
    }
    async handle(req, next) {
        const response = await next();
        const payloadLength = response.data ? JSON.stringify(response.data).length : 0;
        if (payloadLength >= this.thresholdBytes) {
            response.meta = {
                ...response.meta,
                headers: { ...(response.meta?.headers || {}), 'Content-Encoding': 'gzip' },
            };
        }
        return response;
    }
}
exports.CompressionMiddleware = CompressionMiddleware;
