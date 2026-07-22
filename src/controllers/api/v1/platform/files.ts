import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { ModuleBaseController } from '../../../abstraction';
import { BaseResponseEnvelopeDTO } from '../../../../dto/controller/responses/base_envelope';
import { FileStorageStreamUtility } from '../../../../utilities/file_storage';
import { UuidService } from '../../../../utilities/system_services';

export class UploadFileController extends ModuleBaseController {
  constructor(private readonly fileStorage: FileStorageStreamUtility) {
    super();
  }

  public async handle(req: IHttpRequest<{ name: string; mimeType: string; contentBase64: string }>): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    const fileId = new UuidService().generate();
    const buffer = Buffer.from(req.body.contentBase64 || '', 'base64');
    const metadata = await this.fileStorage.uploadStream(fileId, req.body.name, req.body.mimeType, buffer);

    return this.created(metadata, 'File uploaded successfully', 'FILE_UPLOADED', req.context);
  }
}

export class DownloadFileController extends ModuleBaseController {
  constructor(private readonly fileStorage: FileStorageStreamUtility) {
    super();
  }

  public async handle(req: IHttpRequest<any, { storagePath: string }>): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    const path = req.params.storagePath || req.query.path;
    const buffer = await this.fileStorage.downloadStream(path);

    return this.success({ storagePath: path, contentBase64: buffer.toString('base64') }, 'File retrieved successfully', 'FILE_DOWNLOADED', req.context);
  }
}
