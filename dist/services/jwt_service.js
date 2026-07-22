"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
class JwtService {
    async generateToken(payload) {
        return `jwt_token_${JSON.stringify(payload)}`;
    }
    async verifyToken(token) {
        return { userId: 'sample_id' };
    }
}
exports.JwtService = JwtService;
