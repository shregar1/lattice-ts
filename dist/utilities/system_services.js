"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidService = exports.SystemClockService = void 0;
const abstraction_1 = require("./abstraction");
class SystemClockService extends abstraction_1.ModuleBaseUtility {
    now() {
        return new Date();
    }
    timestamp() {
        return Date.now();
    }
}
exports.SystemClockService = SystemClockService;
class UuidService extends abstraction_1.ModuleBaseUtility {
    generate() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
exports.UuidService = UuidService;
