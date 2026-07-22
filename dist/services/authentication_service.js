"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
class AuthenticationService {
    async hashPassword(password) {
        return `hashed_${password}`;
    }
    async verifyPassword(password, hash) {
        return `hashed_${password}` === hash;
    }
}
exports.AuthenticationService = AuthenticationService;
