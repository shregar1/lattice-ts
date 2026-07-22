"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericLookupRepository = void 0;
const abstraction_1 = require("../abstraction");
class GenericLookupRepository extends abstraction_1.BaseRepository {
    cacheClient;
    ttlSeconds;
    cacheKeyPrefix;
    constructor(dbModel, cacheClient, entityName, ttlSeconds = 3600) {
        super(dbModel);
        this.cacheClient = cacheClient;
        this.ttlSeconds = ttlSeconds;
        this.cacheKeyPrefix = `lookup:${entityName.toLowerCase()}:`;
    }
    async findByCode(code) {
        const cacheKey = `${this.cacheKeyPrefix}code:${code.toLowerCase()}`;
        const cached = await this.cacheClient.get(cacheKey);
        if (cached) {
            return cached;
        }
        const criteria = {
            conditions: [{ field: 'code', operator: 'eq', value: code }],
        };
        const entity = await this.findOne(criteria);
        if (entity) {
            await this.cacheClient.set(cacheKey, entity, this.ttlSeconds);
        }
        return entity;
    }
    async getAllActive() {
        const cacheKey = `${this.cacheKeyPrefix}all_active`;
        const cached = await this.cacheClient.get(cacheKey);
        if (cached) {
            return cached;
        }
        const criteria = {
            conditions: [{ field: 'isActive', operator: 'eq', value: true }],
        };
        const items = await this.findAll(criteria);
        await this.cacheClient.set(cacheKey, items, this.ttlSeconds);
        return items;
    }
    async clearCache() {
        await this.cacheClient.delete(`${this.cacheKeyPrefix}all_active`);
    }
    mapToEntity(model) {
        return {
            id: model.id,
            code: model.code,
            name: model.name,
            description: model.description,
            isActive: model.is_active ?? model.isActive ?? true,
        };
    }
    mapToModel(entity) {
        return {
            id: entity.id,
            code: entity.code,
            name: entity.name,
            description: entity.description,
            is_active: entity.isActive,
        };
    }
}
exports.GenericLookupRepository = GenericLookupRepository;
