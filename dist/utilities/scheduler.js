"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerUtility = void 0;
const abstraction_1 = require("./abstraction");
const logger_1 = require("./logger");
class SchedulerUtility extends abstraction_1.ModuleBaseUtility {
    static jobs = new Map();
    logger;
    constructor(logger) {
        super();
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    scheduleRecurring(name, intervalMs, handler) {
        if (SchedulerUtility.jobs.has(name)) {
            this.cancel(name);
        }
        const timerId = setInterval(async () => {
            try {
                await handler();
            }
            catch (err) {
                this.logger.error(`Scheduled task '${name}' failed:`, err);
            }
        }, intervalMs);
        SchedulerUtility.jobs.set(name, { name, intervalMs, handler, timerId });
        this.logger.info(`Scheduled recurring task '${name}' every ${intervalMs}ms`);
    }
    cancel(name) {
        const job = SchedulerUtility.jobs.get(name);
        if (!job)
            return false;
        if (job.timerId) {
            clearInterval(job.timerId);
        }
        SchedulerUtility.jobs.delete(name);
        this.logger.info(`Cancelled scheduled task '${name}'`);
        return true;
    }
    stopAll() {
        for (const name of SchedulerUtility.jobs.keys()) {
            this.cancel(name);
        }
    }
}
exports.SchedulerUtility = SchedulerUtility;
