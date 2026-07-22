"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const abstraction_1 = require("../abstraction");
class UserRepository extends abstraction_1.BaseRepository {
    constructor(dbModel) {
        super(dbModel);
    }
    async findByEmail(email) {
        const criteria = {
            conditions: [{ field: 'email', operator: 'eq', value: email }],
        };
        return await this.findOne(criteria);
    }
    mapToEntity(model) {
        return {
            id: model.id,
            email: model.email,
            passwordHash: model.password_hash || model.passwordHash,
            firstName: model.first_name || model.firstName,
            lastName: model.last_name || model.lastName,
            isActive: model.is_active ?? true,
            createdAt: model.created_at || new Date(),
            updatedAt: model.updated_at || new Date(),
        };
    }
    mapToModel(entity) {
        return {
            id: entity.id,
            email: entity.email,
            password_hash: entity.passwordHash,
            first_name: entity.firstName,
            last_name: entity.lastName,
            is_active: entity.isActive,
        };
    }
}
exports.UserRepository = UserRepository;
