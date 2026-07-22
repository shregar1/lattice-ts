import { ModuleBaseUtility } from '../abstraction';

export interface IDatabaseTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
}

export interface IDatabaseDriver {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  beginTransaction(): Promise<IDatabaseTransaction>;
  healthCheck(): Promise<boolean>;
  getDriverName(): string;
}

export abstract class BaseDatabaseDriver extends ModuleBaseUtility implements IDatabaseDriver {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  abstract beginTransaction(): Promise<IDatabaseTransaction>;
  abstract healthCheck(): Promise<boolean>;
  abstract getDriverName(): string;
}
