import { ModuleBaseUtility } from './abstraction';

export interface IStorageClient {
  upload(path: string, content: Buffer): Promise<string>;
  download(path: string): Promise<Buffer | null>;
  delete(path: string): Promise<boolean>;
}

export class LocalStorageClient extends ModuleBaseUtility implements IStorageClient {
  private static storageMap = new Map<string, Buffer>();

  constructor() {
    super();
  }

  public async upload(path: string, content: Buffer): Promise<string> {
    LocalStorageClient.storageMap.set(path, content);
    return path;
  }

  public async download(path: string): Promise<Buffer | null> {
    return LocalStorageClient.storageMap.get(path) || null;
  }

  public async delete(path: string): Promise<boolean> {
    return LocalStorageClient.storageMap.delete(path);
  }
}
