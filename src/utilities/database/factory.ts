import { IDatabaseDriver } from './driver';
import { SqliteDriver } from './sqlite_driver';
import { PostgresDriver, IPostgresConfig } from './postgres_driver';

export type DatabaseType = 'sqlite' | 'postgres' | string;

export interface IDatabaseConfig {
  type?: DatabaseType;
  sqlitePath?: string;
  postgresConfig?: IPostgresConfig;
  customDriver?: IDatabaseDriver;
}

export class DatabaseDriverFactory {
  public static createDriver(config: IDatabaseConfig = {}): IDatabaseDriver {
    if (config.customDriver) {
      return config.customDriver;
    }

    const type = (config.type || process.env.DATABASE_TYPE || 'sqlite').toLowerCase();

    switch (type) {
      case 'postgres':
      case 'postgresql':
      case 'pg':
        return new PostgresDriver(config.postgresConfig);
      case 'sqlite':
      case 'sqlite3':
      default:
        return new SqliteDriver(config.sqlitePath || process.env.SQLITE_DB_PATH || ':memory:');
    }
  }
}
