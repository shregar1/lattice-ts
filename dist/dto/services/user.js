"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceDTO = void 0;
const dto_1 = require("../../abstractions/dto");
class UserServiceDTO extends dto_1.ModuleBaseDTO {
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
exports.UserServiceDTO = UserServiceDTO;
