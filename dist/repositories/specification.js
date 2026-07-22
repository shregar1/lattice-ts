"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveRecordSpecification = exports.NotSpecification = exports.OrSpecification = exports.AndSpecification = exports.BaseSpecification = void 0;
class BaseSpecification {
    and(other) {
        return new AndSpecification(this, other);
    }
    or(other) {
        return new OrSpecification(this, other);
    }
    not() {
        return new NotSpecification(this);
    }
}
exports.BaseSpecification = BaseSpecification;
class AndSpecification extends BaseSpecification {
    left;
    right;
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    isSatisfiedBy(entity) {
        return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
    }
    toQueryCriteria() {
        const leftCriteria = this.left.toQueryCriteria();
        const rightCriteria = this.right.toQueryCriteria();
        return {
            conditions: [...(leftCriteria.conditions || []), ...(rightCriteria.conditions || [])],
        };
    }
}
exports.AndSpecification = AndSpecification;
class OrSpecification extends BaseSpecification {
    left;
    right;
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    isSatisfiedBy(entity) {
        return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity);
    }
    toQueryCriteria() {
        const leftCriteria = this.left.toQueryCriteria();
        const rightCriteria = this.right.toQueryCriteria();
        return {
            conditions: [...(leftCriteria.conditions || []), ...(rightCriteria.conditions || [])],
        };
    }
}
exports.OrSpecification = OrSpecification;
class NotSpecification extends BaseSpecification {
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
// Reusable Specifications
class ActiveRecordSpecification extends BaseSpecification {
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
