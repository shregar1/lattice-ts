import { IDatabaseDriver } from './driver';
import { SqliteDriver } from './sqlite_driver';
import { PostgresDriver, IPostgresConfig } from './postgres_driver';
import { IDocumentDatabaseDriver } from './nosql/abstraction';
import { InMemoryDocumentDriver } from './nosql/in_memory_doc_driver';
import { MongoDbDriver, IMongoDBConfig } from './nosql/mongodb_driver';

export type DatabaseType = 'sqlite' | 'postgres' | string;
export type NoSqlDatabaseType = 'in_memory_doc' | 'mongodb' | 'mongo' | string;

export interface IDatabaseConfig {
  type?: DatabaseType;
  sqlitePath?: string;
  postgresConfig?: IPostgresConfig;
  customDriver?: IDatabaseDriver;
}

export interface INoSqlDatabaseConfig {
  type?: NoSqlDatabaseType;
  mongoConfig?: IMongoDBConfig;
  customDriver?: IDocumentDatabaseDriver;
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

  public static createDocumentDriver(config: INoSqlDatabaseConfig = {}): IDocumentDatabaseDriver {
    if (config.customDriver) {
      return config.customDriver;
    }

    const type = (config.type || process.env.NOSQL_DATABASE_TYPE || 'in_memory_doc').toLowerCase();

    switch (type) {
      case 'mongodb':
      case 'mongo':
        return new MongoDbDriver(config.mongoConfig);
      case 'in_memory_doc':
      case 'memory':
      default:
        return new InMemoryDocumentDriver();
    }
  }
}
