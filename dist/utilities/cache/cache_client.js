"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheClient = void 0;
class InMemoryCacheClient {
    cache = new Map();
    async get(key) {
        const item = this.cache.get(key);
        if (!item)
            return null;
        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value, ttlSeconds) {
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
        this.cache.set(key, { value, expiresAt });
    }
    async delete(key) {
        return this.cache.delete(key);
    }
    async clear() {
        this.cache.clear();
    }
}
exports.InMemoryCacheClient = InMemoryCacheClient;
