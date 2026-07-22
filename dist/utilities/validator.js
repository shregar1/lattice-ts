"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValidator = void 0;
const abstraction_1 = require("./abstraction");
class BaseValidator extends abstraction_1.ModuleBaseUtility {
    static isUuid(val) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(val);
    }
    static isEmail(val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
    }
    static isPhone(val) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(val);
    }
    static isIsoDate(val) {
        return !isNaN(Date.parse(val));
    }
    static isPositiveNumber(val) {
        return typeof val === 'number' && val > 0;
    }
    static isEnum(val, enumObj) {
        return Object.values(enumObj).includes(val);
    }
    static isNonEmptyString(val) {
        return typeof val === 'string' && val.trim().length > 0;
    }
}
exports.BaseValidator = BaseValidator;
