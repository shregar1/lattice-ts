"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOrchestrator = void 0;
const logger_1 = require("../utilities/logger");
class BaseOrchestrator {
    unitOfWork;
    logger;
    constructor(unitOfWork, logger) {
        this.unitOfWork = unitOfWork;
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    async executeInTransaction(work, actionName) {
        this.logger.info(`Starting transaction boundary for action: ${actionName}`);
        try {
            const result = await this.unitOfWork.executeInTransaction(work);
            this.logger.info(`Transaction committed successfully for action: ${actionName}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Transaction failed and rolled back for action: ${actionName}`, error);
            throw error;
        }
    }
}
exports.BaseOrchestrator = BaseOrchestrator;
