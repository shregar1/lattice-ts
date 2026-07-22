"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
const factory_1 = require("../abstractions/factory");
const user_1 = require("../repositories/user");
const abstraction_1 = require("../repositories/lookups/abstraction");
class RepositoryFactory extends factory_1.BaseFactory {
    create(repositoryType, dbModel, cacheClient, entityName) {
        switch (repositoryType.toLowerCase()) {
            case 'user':
                return new user_1.UserRepository(dbModel);
            case 'lookup':
                if (!cacheClient || !entityName) {
                    throw new Error('Cache client and entity name are required to create a GenericLookupRepository');
                }
                return new abstraction_1.GenericLookupRepository(dbModel, cacheClient, entityName);
            default:
                throw new Error(`Unknown repository type '${repositoryType}'`);
        }
    }
    createUserRepository(dbModel) {
        return new user_1.UserRepository(dbModel);
    }
    createLookupRepository(dbModel, cacheClient, entityName) {
        return new abstraction_1.GenericLookupRepository(dbModel, cacheClient, entityName);
    }
}
exports.RepositoryFactory = RepositoryFactory;
