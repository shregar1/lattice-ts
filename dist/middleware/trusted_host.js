"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustedHostMiddleware = void 0;
const abstraction_1 = require("./abstraction");
const forbidden_1 = require("../exceptions/forbidden");
class TrustedHostMiddleware extends abstraction_1.ModuleBaseMiddleware {
    allowedHosts;
    constructor(allowedHosts = ['localhost', '127.0.0.1']) {
        super();
        this.allowedHosts = allowedHosts;
    }
    async handle(req, next) {
        const hostHeader = (req.headers && (req.headers['host'] || req.headers['x-forwarded-host'])) || '';
        const host = hostHeader.split(':')[0].trim().toLowerCase();
        if (this.allowedHosts.length > 0 && !this.allowedHosts.includes(host) && !this.allowedHosts.includes('*')) {
            throw new forbidden_1.ForbiddenException(`Host '${host}' is not allowed`, 'UNTRUSTED_HOST');
        }
        return await next();
    }
}
exports.TrustedHostMiddleware = TrustedHostMiddleware;
