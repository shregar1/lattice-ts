"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const abstraction_1 = require("./abstraction");
const unauthorized_1 = require("../exceptions/unauthorized");
class AuthenticationMiddleware extends abstraction_1.ModuleBaseMiddleware {
    jwtService;
    constructor(jwtService) {
        super();
        this.jwtService = jwtService;
    }
    async handle(req, next) {
        const authHeader = (req.headers && req.headers['authorization']) || '';
        if (!authHeader.startsWith('Bearer ')) {
            return await next();
        }
        const token = authHeader.substring(7).trim();
        try {
            const claims = await this.jwtService.verifyToken(token);
            if (req.context) {
                req.context.userId = claims.userId || claims.sub;
                req.context.tenantId = claims.tenantId;
                req.context.roles = claims.roles || [];
                req.context.permissions = claims.permissions || [];
            }
        }
        catch (err) {
            throw new unauthorized_1.UnauthorizedException('Invalid or expired authentication token', 'INVALID_TOKEN');
        }
        return await next();
    }
}
exports.AuthenticationMiddleware = AuthenticationMiddleware;
