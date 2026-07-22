"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingUtility = void 0;
const abstraction_1 = require("./abstraction");
class TracingUtility extends abstraction_1.ModuleBaseUtility {
    static activeSpans = new Map();
    static startSpan(name, tags = {}) {
        const spanId = `span_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const span = {
            spanId,
            name,
            startTime: performance.now(),
            tags,
        };
        TracingUtility.activeSpans.set(spanId, span);
        return spanId;
    }
    static endSpan(spanId) {
        const span = TracingUtility.activeSpans.get(spanId);
        if (!span)
            return null;
        span.endTime = performance.now();
        span.durationMs = Number((span.endTime - span.startTime).toFixed(2));
        TracingUtility.activeSpans.delete(spanId);
        return span;
    }
}
exports.TracingUtility = TracingUtility;
