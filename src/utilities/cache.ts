import { ModuleBaseUtility } from './abstraction';

export interface ICacheClient {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

export class InMemoryCacheClient extends ModuleBaseUtility implements ICacheClient {
  private static store = new Map<string, { value: any; expiresAt: number | null }>();

  public async get<T>(key: string): Promise<T | null> {
    const entry = InMemoryCacheClient.store.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      InMemoryCacheClient.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    InMemoryCacheClient.store.set(key, { value, expiresAt });
  }

  public async delete(key: string): Promise<boolean> {
    return InMemoryCacheClient.store.delete(key);
  }

  public async clear(): Promise<void> {
    InMemoryCacheClient.store.clear();
  }
}
