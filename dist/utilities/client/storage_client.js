"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageClient = void 0;
class LocalStorageClient {
    async upload(path, content) {
        return `/storage/local/${path}`;
    }
    async download(path) {
        return Buffer.from(`mock_content_for_${path}`);
    }
    async delete(path) {
        return true;
    }
    async getUrl(path) {
        return `http://localhost:8080/storage/${path}`;
    }
}
exports.LocalStorageClient = LocalStorageClient;
