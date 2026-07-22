"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheClient = void 0;
const abstraction_1 = require("./abstraction");
class InMemoryCacheClient extends abstraction_1.ModuleBaseUtility {
    static store = new Map();
    async get(key) {
        const entry = InMemoryCacheClient.store.get(key);
        if (!entry) {
            return null;
        }
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            InMemoryCacheClient.store.delete(key);
            return null;
        }
        return entry.value;
    }
    async set(key, value, ttlSeconds) {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        InMemoryCacheClient.store.set(key, { value, expiresAt });
    }
    async delete(key) {
        return InMemoryCacheClient.store.delete(key);
    }
    async clear() {
        InMemoryCacheClient.store.clear();
    }
}
exports.InMemoryCacheClient = InMemoryCacheClient;
