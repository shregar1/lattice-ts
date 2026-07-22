import { IDatabaseDriver, IDatabaseTransaction } from './driver';

export abstract class BaseCustomDatabaseDriver implements IDatabaseDriver {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  abstract beginTransaction(): Promise<IDatabaseTransaction>;
  abstract healthCheck(): Promise<boolean>;
  abstract getDriverName(): string;
}
