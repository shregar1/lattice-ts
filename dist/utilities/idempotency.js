"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdempotencyUtility = void 0;
const abstraction_1 = require("./abstraction");
const logger_1 = require("./logger");
class IdempotencyUtility extends abstraction_1.ModuleBaseUtility {
    cacheClient;
    logger;
    constructor(cacheClient, logger) {
        super();
        this.cacheClient = cacheClient;
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    async executeIdempotent(idempotencyKey, operation, ttlSeconds = 86400) {
        const cacheKey = `idempotency:${idempotencyKey}`;
        const cachedResponse = await this.cacheClient.get(cacheKey);
        if (cachedResponse !== null) {
            this.logger.info(`Replaying cached response for idempotency key '${idempotencyKey}'`);
            return cachedResponse;
        }
        const result = await operation();
        await this.cacheClient.set(cacheKey, result, ttlSeconds);
        return result;
    }
}
exports.IdempotencyUtility = IdempotencyUtility;
