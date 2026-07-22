"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundTaskUtility = void 0;
const abstraction_1 = require("./abstraction");
class BackgroundTaskUtility extends abstraction_1.ModuleBaseUtility {
    static processors = new Map();
    static registerProcessor(jobName, processor) {
        BackgroundTaskUtility.processors.set(jobName, processor);
    }
    static async enqueue(jobName, data) {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const processor = BackgroundTaskUtility.processors.get(jobName);
        if (processor) {
            // Async dispatch without blocking main thread
            setImmediate(async () => {
                try {
                    await processor({ id: jobId, name: jobName, data });
                }
                catch (err) {
                    console.error(`Background job ${jobId} failed:`, err);
                }
            });
        }
        return jobId;
    }
}
exports.BackgroundTaskUtility = BackgroundTaskUtility;
