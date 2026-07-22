export * from './database';

export interface IStorageClient {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  upload(path: string, buffer: Buffer): Promise<void>;
  download(path: string): Promise<Buffer | null>;
}

export class LocalStorageClient implements IStorageClient {
  private store = new Map<string, any>();
  private fileStore = new Map<string, Buffer>();

  async get<T>(key: string): Promise<T | null> {
    return this.store.get(key) || null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
    this.fileStore.clear();
  }

  async upload(path: string, buffer: Buffer): Promise<void> {
    this.fileStore.set(path, buffer);
  }

  async download(path: string): Promise<Buffer | null> {
    return this.fileStore.get(path) || null;
  }
}
