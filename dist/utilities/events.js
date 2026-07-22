"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBusUtility = void 0;
const abstraction_1 = require("./abstraction");
class EventBusUtility extends abstraction_1.ModuleBaseUtility {
    static handlersMap = new Map();
    static subscribe(eventName, handler) {
        const handlers = EventBusUtility.handlersMap.get(eventName) || [];
        handlers.push(handler);
        EventBusUtility.handlersMap.set(eventName, handlers);
    }
    static async publish(eventName, payload) {
        const handlers = EventBusUtility.handlersMap.get(eventName) || [];
        const event = {
            eventName,
            occurredAt: new Date(),
            payload,
        };
        for (const handler of handlers) {
            await handler(event);
        }
    }
    static clearHandlers() {
        EventBusUtility.handlersMap.clear();
    }
}
exports.EventBusUtility = EventBusUtility;
