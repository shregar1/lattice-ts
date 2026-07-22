import { BaseCacheClient } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export class InMemoryCacheDriver extends BaseCacheClient {
  private readonly logger: ILogger = new StructuredLogger('InMemoryCacheDriver');
  private store = new Map<string, { value: any; expiresAt?: number }>();

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
  }

  public async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  public async clear(): Promise<void> {
    this.store.clear();
  }

  public async has(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }

  public getDriverName(): string {
    return 'in_memory';
  }
}

export const InMemoryCacheClient = InMemoryCacheDriver;
