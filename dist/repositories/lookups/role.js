"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const abstraction_1 = require("./abstraction");
class RoleRepository extends abstraction_1.GenericLookupRepository {
    constructor(dbModel, cacheClient) {
        super(dbModel, cacheClient, 'Role');
    }
}
exports.RoleRepository = RoleRepository;
