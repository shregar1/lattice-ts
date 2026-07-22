"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveRecordSpecification = void 0;
const abstraction_1 = require("./abstraction");
class ActiveRecordSpecification extends abstraction_1.BaseSpecification {
    isSatisfiedBy(entity) {
        return !entity.is_deleted;
    }
    toQueryCriteria() {
        return {
            conditions: [{ field: 'is_deleted', operator: 'eq', value: false }],
        };
    }
}
exports.ActiveRecordSpecification = ActiveRecordSpecification;
