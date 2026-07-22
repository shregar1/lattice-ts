"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDTO = exports.AuthResponseDTO = void 0;
const abstraction_1 = require("../../abstraction");
class AuthResponseDTO extends abstraction_1.ModuleBaseDTO {
    userId;
    email;
    token;
    constructor(userId, email, token) {
        super();
        this.userId = userId;
        this.email = email;
        this.token = token;
    }
}
exports.AuthResponseDTO = AuthResponseDTO;
class UserResponseDTO extends abstraction_1.ModuleBaseDTO {
    id;
    email;
    firstName;
    lastName;
    isActive;
    constructor(id, email, firstName, lastName, isActive) {
        super();
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
    }
}
exports.UserResponseDTO = UserResponseDTO;
