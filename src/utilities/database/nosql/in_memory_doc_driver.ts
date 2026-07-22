import { BaseDocumentDatabaseDriver, IDocumentQueryFilter, IDocumentQueryOptions } from './abstraction';
import { StructuredLogger, ILogger } from '../../logger';

export class InMemoryDocumentDriver extends BaseDocumentDatabaseDriver {
  private readonly logger: ILogger = new StructuredLogger('InMemoryDocumentDriver');
  private collections = new Map<string, Map<string, any>>();
  private isConnected: boolean = false;

  public async connect(): Promise<void> {
    this.isConnected = true;
    this.logger.info('Connected to In-Memory Document Store');
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    this.logger.info('Disconnected from In-Memory Document Store');
  }

  public async insertDocument<T = any>(collection: string, doc: T): Promise<string> {
    if (!this.collections.has(collection)) {
      this.collections.set(collection, new Map());
    }
    const store = this.collections.get(collection)!;
    const id = (doc as any).id || (doc as any)._id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fullDoc = { ...doc, id, _id: id };
    store.set(id, fullDoc);
    this.logger.info(`[InMemoryDocStore] Inserted document '${id}' into collection '${collection}'`);
    return id;
  }

  public async findDocumentById<T = any>(collection: string, id: string): Promise<T | null> {
    const store = this.collections.get(collection);
    if (!store) return null;
    return (store.get(id) as T) || null;
  }

  public async findDocuments<T = any>(collection: string, filter?: IDocumentQueryFilter, options?: IDocumentQueryOptions): Promise<T[]> {
    const store = this.collections.get(collection);
    if (!store) return [];
    let items = Array.from(store.values());

    if (filter && Object.keys(filter).length > 0) {
      items = items.filter((item) => {
        return Object.entries(filter).every(([key, val]) => item[key] === val);
      });
    }

    if (options?.skip) items = items.slice(options.skip);
    if (options?.limit) items = items.slice(0, options.limit);

    return items as T[];
  }

  public async updateDocument<T = any>(collection: string, id: string, update: Partial<T>): Promise<boolean> {
    const store = this.collections.get(collection);
    if (!store || !store.has(id)) return false;
    const existing = store.get(id);
    store.set(id, { ...existing, ...update });
    this.logger.info(`[InMemoryDocStore] Updated document '${id}' in collection '${collection}'`);
    return true;
  }

  public async deleteDocument(collection: string, id: string): Promise<boolean> {
    const store = this.collections.get(collection);
    if (!store) return false;
    const deleted = store.delete(id);
    if (deleted) this.logger.info(`[InMemoryDocStore] Deleted document '${id}' from collection '${collection}'`);
    return deleted;
  }

  public async createCollection(collection: string): Promise<void> {
    if (!this.collections.has(collection)) {
      this.collections.set(collection, new Map());
      this.logger.info(`[InMemoryDocStore] Created collection '${collection}'`);
    }
  }

  public async createIndex(collection: string, fields: string[]): Promise<void> {
    this.logger.info(`[InMemoryDocStore] Index created on collection '${collection}' for fields: ${fields.join(', ')}`);
  }

  public async healthCheck(): Promise<boolean> {
    return this.isConnected;
  }

  public getDriverName(): string {
    return 'in_memory_doc';
  }
}
