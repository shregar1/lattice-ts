"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationOrchestrator = void 0;
const auth_1 = require("../dto/controller/responses/auth");
const base_exception_1 = require("../exceptions/base.exception");
class AuthenticationOrchestrator {
    userService;
    authService;
    jwtService;
    unitOfWork;
    constructor(userService, authService, jwtService, unitOfWork) {
        this.userService = userService;
        this.authService = authService;
        this.jwtService = jwtService;
        this.unitOfWork = unitOfWork;
    }
    async register(dto) {
        return await this.unitOfWork.executeInTransaction(async () => {
            const existingUser = await this.userService.getUserByEmail(dto.email);
            if (existingUser) {
                throw new base_exception_1.ConflictException('User with this email already exists');
            }
            const passwordHash = await this.authService.hashPassword(dto.password);
            const user = await this.userService.createUser({
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
            });
            const token = await this.jwtService.generateToken({ userId: user.id });
            return new auth_1.AuthResponseDto(user.id, user.email, token);
        });
    }
    async login(dto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) {
            throw new base_exception_1.UnauthorizedException('Invalid email or password');
        }
        const isValid = await this.authService.verifyPassword(dto.password, user.passwordHash);
        if (!isValid) {
            throw new base_exception_1.UnauthorizedException('Invalid email or password');
        }
        const token = await this.jwtService.generateToken({ userId: user.id });
        return new auth_1.AuthResponseDto(user.id, user.email, token);
    }
}
exports.AuthenticationOrchestrator = AuthenticationOrchestrator;
