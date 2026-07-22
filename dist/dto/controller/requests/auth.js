"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequestDTO = exports.RegisterRequestDTO = void 0;
const abstraction_1 = require("../../abstraction");
class RegisterRequestDTO extends abstraction_1.ModuleBaseDTO {
    email;
    password;
    firstName;
    lastName;
    constructor(email, password, firstName, lastName) {
        super();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
exports.RegisterRequestDTO = RegisterRequestDTO;
class LoginRequestDTO extends abstraction_1.ModuleBaseDTO {
    email;
    password;
    constructor(email, password) {
        super();
        this.email = email;
        this.password = password;
    }
}
exports.LoginRequestDTO = LoginRequestDTO;
