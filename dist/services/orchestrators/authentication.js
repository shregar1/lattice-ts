"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationOrchestrator = void 0;
const orchestrator_1 = require("../../abstractions/orchestrator");
const auth_1 = require("../../dto/controller/requests/auth");
const conflict_1 = require("../../exceptions/conflict");
const unauthenticated_1 = require("../../exceptions/unauthenticated");
const performance_decorator_1 = require("../../utilities/performance_decorator");
class AuthenticationOrchestrator extends orchestrator_1.BaseOrchestrator {
    userService;
    authService;
    jwtService;
    constructor(userService, authService, jwtService, unitOfWork) {
        super(unitOfWork);
        this.userService = userService;
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async register(dto) {
        return await this.executeInTransaction(async () => {
            const existingUser = await this.userService.getUserByEmail(dto.email);
            if (existingUser) {
                throw new conflict_1.ConflictException(`User with email '${dto.email}' already exists`);
            }
            const passwordHash = await this.authService.hashPassword(dto.password);
            // Pass context downstream for timing collection
            const createdUser = await this.userService.createUser({
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
            }, dto.context);
            const token = await this.jwtService.generateToken({
                userId: createdUser.id,
                email: createdUser.email,
            });
            return {
                email: createdUser.email,
                token,
            };
        }, 'AuthenticationOrchestrator.register');
    }
    async login(dto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) {
            throw new unauthenticated_1.UnauthenticatedException('Invalid email or password');
        }
        const isValidPassword = await this.authService.verifyPassword(dto.password, user.passwordHash);
        if (!isValidPassword) {
            throw new unauthenticated_1.UnauthenticatedException('Invalid email or password');
        }
        const token = await this.jwtService.generateToken({
            userId: user.id,
            email: user.email,
        });
        return {
            email: user.email,
            token,
        };
    }
}
exports.AuthenticationOrchestrator = AuthenticationOrchestrator;
__decorate([
    (0, performance_decorator_1.MeasurePerformance)('orchestrator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationOrchestrator.prototype, "register", null);
__decorate([
    (0, performance_decorator_1.MeasurePerformance)('orchestrator'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_1.LoginRequestDTO]),
    __metadata("design:returntype", Promise)
], AuthenticationOrchestrator.prototype, "login", null);
