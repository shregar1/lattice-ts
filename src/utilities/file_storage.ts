import { ModuleBaseUtility } from './abstraction';
import { IStorageClient } from './storage';
import { BadRequestException } from '../exceptions/bad_request';

export interface IFileMetadata {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedAt: Date;
}

export class FileStorageStreamUtility extends ModuleBaseUtility {
  constructor(
    private readonly storageClient: IStorageClient,
    private readonly maxFileSizeBytes: number = 10 * 1024 * 1024,
    private readonly allowedMimeTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain']
  ) {
    super();
  }

  public async validateFile(name: string, mimeType: string, sizeBytes: number): Promise<void> {
    if (sizeBytes > this.maxFileSizeBytes) {
      throw new BadRequestException(`File size exceeds limit of ${this.maxFileSizeBytes} bytes`, 'FILE_TOO_LARGE');
    }

    if (this.allowedMimeTypes.length > 0 && !this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`MIME type '${mimeType}' is not allowed`, 'UNSUPPORTED_MIME_TYPE');
    }
  }

  public async uploadStream(fileId: string, name: string, mimeType: string, buffer: Buffer): Promise<IFileMetadata> {
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

  public async downloadStream(storagePath: string): Promise<Buffer> {
    const data = await this.storageClient.download(storagePath);
    if (!data) {
      throw new BadRequestException(`File at path '${storagePath}' not found`, 'FILE_NOT_FOUND');
    }
    return data;
  }
}
