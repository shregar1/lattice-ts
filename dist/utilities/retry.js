"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryUtility = void 0;
const abstraction_1 = require("./abstraction");
class RetryUtility extends abstraction_1.ModuleBaseUtility {
    static async executeWithRetry(operation, policy = { maxRetries: 3, initialDelayMs: 100, backoffFactor: 2 }) {
        let lastError;
        let delay = policy.initialDelayMs;
        for (let attempt = 1; attempt <= policy.maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (err) {
                lastError = err;
                if (attempt === policy.maxRetries)
                    break;
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= policy.backoffFactor;
            }
        }
        throw lastError;
    }
}
exports.RetryUtility = RetryUtility;
