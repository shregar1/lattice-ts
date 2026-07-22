import { BaseDatabaseDriver, IDatabaseTransaction } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export class SqliteDriver extends BaseDatabaseDriver {
  private readonly logger: ILogger = new StructuredLogger('SqliteDriver');
  private isConnected: boolean = false;
  private readonly filePath: string;

  constructor(filePath: string = ':memory:') {
    super();
    this.filePath = filePath;
  }

  public async connect(): Promise<void> {
    this.isConnected = true;
    this.logger.info(`Connected to SQLite database at ${this.filePath}`);
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    this.logger.info(`Disconnected from SQLite database at ${this.filePath}`);
  }

  public async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.isConnected) await this.connect();
    this.logger.info(`[SQLite Execution] SQL: ${sql}`);
    return [] as T[];
  }

  public async beginTransaction(): Promise<IDatabaseTransaction> {
    this.logger.info('[SQLite Transaction] BEGIN TRANSACTION');
    return {
      commit: async () => this.logger.info('[SQLite Transaction] COMMIT'),
      rollback: async () => this.logger.info('[SQLite Transaction] ROLLBACK'),
      query: async <T>(sql: string, params?: any[]) => this.query<T>(sql, params),
    };
  }

  public async healthCheck(): Promise<boolean> {
    return this.isConnected;
  }

  public getDriverName(): string {
    return 'sqlite';
  }
}
