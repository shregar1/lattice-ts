"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestTimeoutMiddleware = exports.RequestTimeoutException = void 0;
const abstraction_1 = require("./abstraction");
const abstraction_2 = require("../exceptions/abstraction");
class RequestTimeoutException extends abstraction_2.BaseException {
    statusCode = 504;
    constructor(message = 'Request Gateway Timeout', code = 'REQUEST_TIMEOUT') {
        super(message, code);
    }
}
exports.RequestTimeoutException = RequestTimeoutException;
class RequestTimeoutMiddleware extends abstraction_1.ModuleBaseMiddleware {
    timeoutMs;
    constructor(timeoutMs = 10000) {
        super();
        this.timeoutMs = timeoutMs;
    }
    async handle(req, next) {
        let timer;
        const timeoutPromise = new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(new RequestTimeoutException(`Request timed out after ${this.timeoutMs}ms`));
            }, this.timeoutMs);
        });
        try {
            const response = await Promise.race([next(), timeoutPromise]);
            clearTimeout(timer);
            return response;
        }
        catch (error) {
            clearTimeout(timer);
            throw error;
        }
    }
}
exports.RequestTimeoutMiddleware = RequestTimeoutMiddleware;
