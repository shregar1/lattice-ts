"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const logger_1 = require("../utilities/logger");
class BaseService {
    logger;
    constructor(logger) {
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    logActivity(message, meta) {
        this.logger.info(message, meta);
    }
}
exports.BaseService = BaseService;
