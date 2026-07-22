"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
class HealthController {
    async getHealth(req) {
        return {
            statusCode: 200,
            success: true,
            message: 'Service is healthy',
            data: {
                status: 'UP',
                timestamp: new Date().toISOString(),
            },
        };
    }
}
exports.HealthController = HealthController;
