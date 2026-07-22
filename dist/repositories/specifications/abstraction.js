"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSpecification = void 0;
class BaseSpecification {
    and(other) {
        const { AndSpecification } = require('./and');
        return new AndSpecification(this, other);
    }
    or(other) {
        const { OrSpecification } = require('./or');
        return new OrSpecification(this, other);
    }
    not() {
        const { NotSpecification } = require('./not');
        return new NotSpecification(this);
    }
}
exports.BaseSpecification = BaseSpecification;
