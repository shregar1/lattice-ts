"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const logger_1 = require("../utilities/logger");
class BaseRepository {
    dbModel;
    logger;
    constructor(dbModel, logger) {
        this.dbModel = dbModel;
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    async findById(id) {
        const record = await this.dbModel.findById(id);
        return record ? this.mapToEntity(record) : null;
    }
    async findByUrn(urn) {
        return await this.findOne({
            conditions: [{ field: 'urn', operator: 'eq', value: urn }],
        });
    }
    async findOne(criteria) {
        const filter = this.buildFilterQuery(criteria);
        const record = await this.dbModel.findOne(filter);
        return record ? this.mapToEntity(record) : null;
    }
    async findAll(criteria) {
        const filter = criteria ? this.buildFilterQuery(criteria) : {};
        const records = await this.dbModel.find(filter);
        return records.map((r) => this.mapToEntity(r));
    }
    async findPaginated(criteria) {
        const filter = this.buildFilterQuery(criteria);
        const page = criteria.pagination?.page || 1;
        const limit = criteria.pagination?.limit || 20;
        const total = await this.count(criteria);
        const items = await this.findAll(criteria);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
    async create(entity) {
        const modelData = this.mapToModel(entity);
        const created = await this.dbModel.create(modelData);
        return this.mapToEntity(created);
    }
    async createMany(entities) {
        const modelsData = entities.map((e) => this.mapToModel(e));
        const createdRecords = await this.dbModel.createMany(modelsData);
        return createdRecords.map((r) => this.mapToEntity(r));
    }
    async update(id, entity) {
        const modelData = this.mapToModel(entity);
        const updated = await this.dbModel.update(id, modelData);
        return this.mapToEntity(updated);
    }
    async updateMany(criteria, data) {
        const filter = this.buildFilterQuery(criteria);
        const modelData = this.mapToModel(data);
        return await this.dbModel.updateMany(filter, modelData);
    }
    async delete(id) {
        return await this.dbModel.delete(id);
    }
    async softDelete(id) {
        return await this.dbModel.update(id, { is_deleted: true, deleted_at: new Date() });
    }
    async restore(id) {
        return await this.dbModel.update(id, { is_deleted: false, deleted_at: null });
    }
    async deleteMany(criteria) {
        const filter = this.buildFilterQuery(criteria);
        return await this.dbModel.deleteMany(filter);
    }
    async count(criteria) {
        const filter = criteria ? this.buildFilterQuery(criteria) : {};
        return await this.dbModel.count(filter);
    }
    async exists(criteria) {
        const count = await this.count(criteria);
        return count > 0;
    }
    async existsByUrn(urn) {
        return await this.exists({
            conditions: [{ field: 'urn', operator: 'eq', value: urn }],
        });
    }
    buildFilterQuery(criteria) {
        const filterQuery = {};
        if (!criteria.conditions || criteria.conditions.length === 0) {
            return filterQuery;
        }
        for (const condition of criteria.conditions) {
            switch (condition.operator) {
                case 'eq':
                    filterQuery[condition.field] = condition.value;
                    break;
                case 'neq':
                    filterQuery[condition.field] = { $ne: condition.value };
                    break;
                case 'gt':
                    filterQuery[condition.field] = { $gt: condition.value };
                    break;
                case 'gte':
                    filterQuery[condition.field] = { $gte: condition.value };
                    break;
                case 'lt':
                    filterQuery[condition.field] = { $lt: condition.value };
                    break;
                case 'lte':
                    filterQuery[condition.field] = { $lte: condition.value };
                    break;
                case 'in':
                    filterQuery[condition.field] = { $in: condition.value };
                    break;
                case 'nin':
                    filterQuery[condition.field] = { $nin: condition.value };
                    break;
                case 'contains':
                    filterQuery[condition.field] = { $regex: condition.value, $options: 'i' };
                    break;
                case 'startsWith':
                    filterQuery[condition.field] = { $regex: `^${condition.value}`, $options: 'i' };
                    break;
                case 'endsWith':
                    filterQuery[condition.field] = { $regex: `${condition.value}$`, $options: 'i' };
                    break;
                default:
                    filterQuery[condition.field] = condition.value;
            }
        }
        return filterQuery;
    }
}
exports.BaseRepository = BaseRepository;
