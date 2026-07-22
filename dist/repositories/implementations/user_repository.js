"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("../base_repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor(dbModel) {
        super(dbModel);
    }
    async findById(id) {
        const record = await this.dbModel.findById(id);
        return record ? this.mapToEntity(record) : null;
    }
    async findByEmail(email) {
        const record = await this.dbModel.findOne({ email });
        return record ? this.mapToEntity(record) : null;
    }
    async findAll(criteria) {
        const records = await this.dbModel.find(criteria || {});
        return records.map((r) => this.mapToEntity(r));
    }
    async create(entity) {
        const modelData = this.mapToModel(entity);
        const created = await this.dbModel.create(modelData);
        return this.mapToEntity(created);
    }
    async update(id, entity) {
        const updated = await this.dbModel.update(id, entity);
        return this.mapToEntity(updated);
    }
    async delete(id) {
        return await this.dbModel.delete(id);
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
