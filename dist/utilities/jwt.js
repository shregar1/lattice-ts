"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtility = void 0;
const abstraction_1 = require("./abstraction");
class JwtUtility extends abstraction_1.ModuleBaseUtility {
    async generateToken(payload, secret = 'default_secret', expiresIn = 86400) {
        return `jwt_token_${JSON.stringify(payload)}`;
    }
    async verifyToken(token, secret = 'default_secret') {
        if (!token.startsWith('jwt_token_')) {
            throw new Error('Invalid JWT Token format');
        }
        const jsonStr = token.substring(10);
        return JSON.parse(jsonStr);
    }
}
exports.JwtUtility = JwtUtility;
