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
