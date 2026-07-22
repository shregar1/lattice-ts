"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilderMiddleware = void 0;
const abstraction_1 = require("./abstraction");
const base_envelope_1 = require("../dto/controller/responses/base_envelope");
class ResponseBuilderMiddleware extends abstraction_1.ModuleBaseMiddleware {
    async handle(req, next) {
        const response = await next();
        // Check environment flag ENABLE_PERFORMANCE_METRICS
        const enableMetrics = process.env.ENABLE_PERFORMANCE_METRICS === 'true';
        let metadata = response.meta || {};
        if (enableMetrics && req.context) {
            const totalLatencyMs = Date.now() - req.context.startTime;
            // Group sub-stage durations by high-level category
            const stageSummaries = {};
            if (req.context.metrics) {
                for (const metric of req.context.metrics) {
                    const stageKey = metric.stage || 'service';
                    stageSummaries[stageKey] = Number(((stageSummaries[stageKey] || 0) + metric.durationMs).toFixed(2));
                }
            }
            metadata = {
                ...metadata,
                statistics: {
                    totalLatencyMs,
                    stagesMs: stageSummaries,
                },
            };
        }
        if (response.data instanceof base_envelope_1.BaseResponseEnvelopeDTO) {
            if (enableMetrics) {
                response.data.metadata = {
                    ...response.data.metadata,
                    ...metadata,
                };
            }
            else {
                // Guarantee no internal statistics leak when disabled
                delete response.data.metadata?.statistics;
            }
            return response;
        }
        const envelope = new base_envelope_1.BaseResponseEnvelopeDTO({
            transactionUrn: req.context?.requestUrn || '',
            status: response.success ? 'SUCCESS' : 'FAILED',
            responseMessage: response.message || 'Operation executed',
            responseKey: response.success ? 'SUCCESS' : 'ERROR',
            errors: response.errors || [],
            timestamp: new Date().toISOString(),
            metadata,
            data: response.data,
            referenceUrn: req.context?.referenceUrn || '',
        });
        return {
            statusCode: response.statusCode,
            success: response.success,
            message: response.message,
            data: envelope,
            meta: response.meta,
        };
    }
}
exports.ResponseBuilderMiddleware = ResponseBuilderMiddleware;
