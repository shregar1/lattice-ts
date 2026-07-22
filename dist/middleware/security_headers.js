"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityHeadersMiddleware = void 0;
const abstraction_1 = require("./abstraction");
class SecurityHeadersMiddleware extends abstraction_1.ModuleBaseMiddleware {
    customHeaders;
    constructor(customHeaders = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'",
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-XSS-Protection': '1; mode=block',
    }) {
        super();
        this.customHeaders = customHeaders;
    }
    async handle(req, next) {
        const response = await next();
        response.meta = { ...response.meta, headers: { ...(response.meta?.headers || {}), ...this.customHeaders } };
        return response;
    }
}
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware;
