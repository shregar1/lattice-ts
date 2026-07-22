"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authOrchestrator;
    constructor(authOrchestrator) {
        this.authOrchestrator = authOrchestrator;
    }
    async register(req) {
        const result = await this.authOrchestrator.register(req.body);
        return {
            statusCode: 201,
            success: true,
            message: 'User registered successfully',
            data: result,
        };
    }
    async login(req) {
        const result = await this.authOrchestrator.login(req.body);
        return {
            statusCode: 200,
            success: true,
            message: 'User authenticated successfully',
            data: result,
        };
    }
}
exports.AuthController = AuthController;
