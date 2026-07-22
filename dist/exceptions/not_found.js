"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const abstraction_1 = require("./abstraction");
class NotFoundException extends abstraction_1.BaseException {
    statusCode = 404;
    constructor(message = 'Requested resource not found', code = 'RESOURCE_NOT_FOUND', errors, details) {
        super(message, code, errors, details);
    }
}
exports.NotFoundException = NotFoundException;
