"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationMiddleware = void 0;
const abstraction_1 = require("./abstraction");
const bad_request_1 = require("../exceptions/bad_request");
class RequestValidationMiddleware extends abstraction_1.ModuleBaseMiddleware {
    schema;
    constructor(schema) {
        super();
        this.schema = schema;
    }
    async handle(req, next) {
        if (this.schema && req.body) {
            if (typeof this.schema === 'function') {
                const errors = this.schema(req.body);
                if (errors && errors.length > 0) {
                    throw new bad_request_1.BadRequestException('Request validation failed', 'VALIDATION_ERROR', errors);
                }
            }
            else {
                const result = this.schema.safeParse(req.body);
                if (!result.success) {
                    const formattedErrors = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
                    throw new bad_request_1.BadRequestException('Request payload validation failed', 'VALIDATION_ERROR', formattedErrors);
                }
            }
        }
        return await next();
    }
}
exports.RequestValidationMiddleware = RequestValidationMiddleware;
