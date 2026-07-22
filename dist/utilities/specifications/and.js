"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndSpecification = void 0;
const abstraction_1 = require("./abstraction");
class AndSpecification extends abstraction_1.BaseSpecification {
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
