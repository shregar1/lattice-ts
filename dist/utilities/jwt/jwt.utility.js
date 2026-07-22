"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtility = void 0;
class JwtUtility {
    async generateToken(payload) {
        return `jwt_token_${JSON.stringify(payload)}`;
    }
    async verifyToken(token) {
        return { userId: 'sample_id' };
    }
}
exports.JwtUtility = JwtUtility;
