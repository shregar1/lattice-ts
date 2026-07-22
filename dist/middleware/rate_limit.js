"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = exports.RateLimitExceededException = void 0;
const abstraction_1 = require("./abstraction");
const abstraction_2 = require("../exceptions/abstraction");
class RateLimitExceededException extends abstraction_2.BaseException {
    statusCode = 429;
    constructor(message = 'Too Many Requests', code = 'RATE_LIMIT_EXCEEDED') {
        super(message, code);
    }
}
exports.RateLimitExceededException = RateLimitExceededException;
class RateLimitMiddleware extends abstraction_1.ModuleBaseMiddleware {
    windowMs;
    maxRequests;
    static ipHits = new Map();
    constructor(windowMs = 60000, maxRequests = 100) {
        super();
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }
    async handle(req, next) {
        const key = req.context?.userId || req.context?.tenantId || req.context?.clientIp || '127.0.0.1';
        const now = Date.now();
        const hit = RateLimitMiddleware.ipHits.get(key) || { count: 0, expiresAt: now + this.windowMs };
        if (now > hit.expiresAt) {
            hit.count = 1;
            hit.expiresAt = now + this.windowMs;
        }
        else {
            hit.count++;
        }
        RateLimitMiddleware.ipHits.set(key, hit);
        if (hit.count > this.maxRequests) {
            throw new RateLimitExceededException(`Rate limit exceeded. Try again in ${Math.ceil((hit.expiresAt - now) / 1000)}s`);
        }
        const response = await next();
        const remaining = Math.max(0, this.maxRequests - hit.count);
        response.meta = {
            ...response.meta,
            headers: {
                ...(response.meta?.headers || {}),
                'X-RateLimit-Limit': String(this.maxRequests),
                'X-RateLimit-Remaining': String(remaining),
                'X-RateLimit-Reset': String(Math.ceil(hit.expiresAt / 1000)),
            },
        };
        return response;
    }
}
exports.RateLimitMiddleware = RateLimitMiddleware;
