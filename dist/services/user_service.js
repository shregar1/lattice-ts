"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const base_exception_1 = require("../exceptions/base.exception");
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new base_exception_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async getUserByEmail(email) {
        return await this.userRepository.findByEmail(email);
    }
    async createUser(userData) {
        return await this.userRepository.create(userData);
    }
}
exports.UserService = UserService;
