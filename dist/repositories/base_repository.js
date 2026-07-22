"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    dbModel;
    constructor(dbModel) {
        this.dbModel = dbModel;
    }
    mapToEntity(model) {
        throw new Error('mapToEntity must be implemented by concrete repository');
    }
    mapToModel(entity) {
        throw new Error('mapToModel must be implemented by concrete repository');
    }
}
exports.BaseRepository = BaseRepository;
