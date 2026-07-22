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
exports.UserService = void 0;
const user_1 = require("../dto/services/user");
const not_found_1 = require("../exceptions/not_found");
const service_1 = require("../abstractions/service");
const performance_decorator_1 = require("../utilities/performance_decorator");
class UserService extends service_1.BaseService {
    userRepository;
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }
    async getUserById(id) {
        this.logger.info(`Fetching user by ID ${id}`);
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new not_found_1.NotFoundException(`User with ID ${id} not found`);
        }
        return new user_1.UserServiceDTO(user.id, user.email, user.firstName, user.lastName, user.isActive);
    }
    async getUserByEmail(email) {
        this.logger.info(`Fetching user by email ${email}`);
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            return null;
        const dto = new user_1.UserServiceDTO(user.id, user.email, user.firstName, user.lastName, user.isActive);
        dto.passwordHash = user.passwordHash;
        return dto;
    }
    async createUser(userData) {
        this.logger.info(`Creating new user account for ${userData.email}`);
        const user = await this.userRepository.create(userData);
        return new user_1.UserServiceDTO(user.id, user.email, user.firstName, user.lastName, user.isActive);
    }
}
exports.UserService = UserService;
__decorate([
    (0, performance_decorator_1.MeasurePerformance)('service'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getUserById", null);
__decorate([
    (0, performance_decorator_1.MeasurePerformance)('service'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getUserByEmail", null);
__decorate([
    (0, performance_decorator_1.MeasurePerformance)('service'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "createUser", null);
