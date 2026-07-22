"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const model_1 = require("../abstractions/model");
class UserModel extends model_1.BaseModel {
    id;
    email;
    passwordHash;
    firstName;
    lastName;
    isActive;
    createdAt;
    updatedAt;
    constructor(data) {
        super();
        this.id = data.id;
        this.email = data.email;
        this.passwordHash = data.passwordHash;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.isActive = data.isActive ?? true;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }
}
exports.UserModel = UserModel;
