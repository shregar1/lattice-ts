"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsMiddleware = void 0;
const abstraction_1 = require("./abstraction");
class CorsMiddleware extends abstraction_1.ModuleBaseMiddleware {
    options;
    constructor(options = {}) {
        super();
        this.options = options;
    }
    async handle(req, next) {
        const origin = (req.headers && req.headers['origin']) || '*';
        const corsHeaders = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': (this.options.allowedMethods || ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']).join(','),
            'Access-Control-Allow-Headers': (this.options.allowedHeaders || ['Content-Type', 'Authorization', 'x-request-id', 'x-correlation-id', 'x-tenant-id']).join(','),
            'Access-Control-Allow-Credentials': String(this.options.allowCredentials ?? true),
        };
        if (req.headers && req.headers['method'] === 'OPTIONS') {
            return {
                statusCode: 204,
                success: true,
                message: 'CORS Preflight Success',
                meta: { headers: corsHeaders },
            };
        }
        const response = await next();
        response.meta = { ...response.meta, headers: { ...(response.meta?.headers || {}), ...corsHeaders } };
        return response;
    }
}
exports.CorsMiddleware = CorsMiddleware;
