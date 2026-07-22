"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageClient = void 0;
const abstraction_1 = require("./abstraction");
class LocalStorageClient extends abstraction_1.ModuleBaseUtility {
    static storageMap = new Map();
    constructor() {
        super();
    }
    async upload(path, content) {
        LocalStorageClient.storageMap.set(path, content);
        return path;
    }
    async download(path) {
        return LocalStorageClient.storageMap.get(path) || null;
    }
    async delete(path) {
        return LocalStorageClient.storageMap.delete(path);
    }
}
exports.LocalStorageClient = LocalStorageClient;
