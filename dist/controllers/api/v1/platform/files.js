"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadFileController = exports.UploadFileController = void 0;
const abstraction_1 = require("../../../abstraction");
const system_services_1 = require("../../../../utilities/system_services");
class UploadFileController extends abstraction_1.ModuleBaseController {
    fileStorage;
    constructor(fileStorage) {
        super();
        this.fileStorage = fileStorage;
    }
    async handle(req) {
        const fileId = new system_services_1.UuidService().generate();
        const buffer = Buffer.from(req.body.contentBase64 || '', 'base64');
        const metadata = await this.fileStorage.uploadStream(fileId, req.body.name, req.body.mimeType, buffer);
        return this.created(metadata, 'File uploaded successfully', 'FILE_UPLOADED', req.context);
    }
}
exports.UploadFileController = UploadFileController;
class DownloadFileController extends abstraction_1.ModuleBaseController {
    fileStorage;
    constructor(fileStorage) {
        super();
        this.fileStorage = fileStorage;
    }
    async handle(req) {
        const path = req.params.storagePath || req.query.path;
        const buffer = await this.fileStorage.downloadStream(path);
        return this.success({ storagePath: path, contentBase64: buffer.toString('base64') }, 'File retrieved successfully', 'FILE_DOWNLOADED', req.context);
    }
}
exports.DownloadFileController = DownloadFileController;
