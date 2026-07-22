"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageStreamUtility = void 0;
const abstraction_1 = require("./abstraction");
const bad_request_1 = require("../exceptions/bad_request");
class FileStorageStreamUtility extends abstraction_1.ModuleBaseUtility {
    storageClient;
    maxFileSizeBytes;
    allowedMimeTypes;
    constructor(storageClient, maxFileSizeBytes = 10 * 1024 * 1024, allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']) {
        super();
        this.storageClient = storageClient;
        this.maxFileSizeBytes = maxFileSizeBytes;
        this.allowedMimeTypes = allowedMimeTypes;
    }
    async validateFile(name, mimeType, sizeBytes) {
        if (sizeBytes > this.maxFileSizeBytes) {
            throw new bad_request_1.BadRequestException(`File size exceeds limit of ${this.maxFileSizeBytes} bytes`, 'FILE_TOO_LARGE');
        }
        if (this.allowedMimeTypes.length > 0 && !this.allowedMimeTypes.includes(mimeType)) {
            throw new bad_request_1.BadRequestException(`MIME type '${mimeType}' is not allowed`, 'UNSUPPORTED_MIME_TYPE');
        }
    }
    async uploadStream(fileId, name, mimeType, buffer) {
        await this.validateFile(name, mimeType, buffer.length);
        const storagePath = `uploads/${fileId}_${name}`;
        await this.storageClient.upload(storagePath, buffer);
        return {
            fileId,
            originalName: name,
            mimeType,
            sizeBytes: buffer.length,
            storagePath,
            uploadedAt: new Date(),
        };
    }
    async downloadStream(storagePath) {
        const data = await this.storageClient.download(storagePath);
        if (!data) {
            throw new bad_request_1.BadRequestException(`File at path '${storagePath}' not found`, 'FILE_NOT_FOUND');
        }
        return data;
    }
}
exports.FileStorageStreamUtility = FileStorageStreamUtility;
