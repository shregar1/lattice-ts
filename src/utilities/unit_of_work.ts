export interface IDatabaseSession {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getClient(): any;
}

export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  executeInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
