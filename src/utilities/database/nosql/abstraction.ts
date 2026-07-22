import { ModuleBaseUtility } from '../../abstraction';

export interface IDocumentQueryFilter {
  [key: string]: any;
}

export interface IDocumentQueryOptions {
  limit?: number;
  skip?: number;
  sort?: { [key: string]: 1 | -1 };
  projection?: { [key: string]: 0 | 1 };
}

export interface IDocumentDatabaseDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  insertDocument<T = any>(collection: string, doc: T): Promise<string>;
  findDocumentById<T = any>(collection: string, id: string): Promise<T | null>;
  findDocuments<T = any>(collection: string, filter?: IDocumentQueryFilter, options?: IDocumentQueryOptions): Promise<T[]>;
  updateDocument<T = any>(collection: string, id: string, update: Partial<T>): Promise<boolean>;
  deleteDocument(collection: string, id: string): Promise<boolean>;
  createCollection(collection: string): Promise<void>;
  createIndex(collection: string, fields: string[]): Promise<void>;
  healthCheck(): Promise<boolean>;
  getDriverName(): string;
}

export abstract class BaseDocumentDatabaseDriver extends ModuleBaseUtility implements IDocumentDatabaseDriver {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract insertDocument<T = any>(collection: string, doc: T): Promise<string>;
  abstract findDocumentById<T = any>(collection: string, id: string): Promise<T | null>;
  abstract findDocuments<T = any>(collection: string, filter?: IDocumentQueryFilter, options?: IDocumentQueryOptions): Promise<T[]>;
  abstract updateDocument<T = any>(collection: string, id: string, update: Partial<T>): Promise<boolean>;
  abstract deleteDocument(collection: string, id: string): Promise<boolean>;
  abstract createCollection(collection: string): Promise<void>;
  abstract createIndex(collection: string, fields: string[]): Promise<void>;
  abstract healthCheck(): Promise<boolean>;
  abstract getDriverName(): string;
}
