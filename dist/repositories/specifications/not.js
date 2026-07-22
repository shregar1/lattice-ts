"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotSpecification = void 0;
const abstraction_1 = require("./abstraction");
class NotSpecification extends abstraction_1.BaseSpecification {
    spec;
    constructor(spec) {
        super();
        this.spec = spec;
    }
    isSatisfiedBy(entity) {
        return !this.spec.isSatisfiedBy(entity);
    }
    toQueryCriteria() {
        const criteria = this.spec.toQueryCriteria();
        return {
            conditions: (criteria.conditions || []).map((c) => ({
                ...c,
                operator: c.operator === 'eq' ? 'neq' : 'eq',
            })),
        };
    }
}
exports.NotSpecification = NotSpecification;
