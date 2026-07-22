"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCheckController = exports.LivenessCheckController = exports.ReadinessCheckController = exports.HealthCheckController = void 0;
const abstraction_1 = require("../../../abstraction");
class HealthCheckController extends abstraction_1.ModuleBaseController {
    async handle(req) {
        return this.success({ status: 'UP', timestamp: new Date().toISOString() }, 'System health normal', 'HEALTH_OK', req.context);
    }
}
exports.HealthCheckController = HealthCheckController;
class ReadinessCheckController extends abstraction_1.ModuleBaseController {
    async handle(req) {
        return this.success({ database: 'CONNECTED', cache: 'CONNECTED' }, 'System ready for traffic', 'READY_OK', req.context);
    }
}
exports.ReadinessCheckController = ReadinessCheckController;
class LivenessCheckController extends abstraction_1.ModuleBaseController {
    async handle(req) {
        return this.success({ alive: true }, 'System process alive', 'LIVE_OK', req.context);
    }
}
exports.LivenessCheckController = LivenessCheckController;
class VersionCheckController extends abstraction_1.ModuleBaseController {
    async handle(req) {
        return this.success({ name: 'BackendServiceScaffold', version: '1.0.0', apiVersion: 'v1' }, 'API Version Info', 'VERSION_OK', req.context);
    }
}
exports.VersionCheckController = VersionCheckController;
