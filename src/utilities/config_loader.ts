import * as fs from 'fs';
import * as path from 'path';
import { ModuleBaseUtility } from './abstraction';
import { DatabaseDriverFactory } from './database/factory';
import { IDatabaseDriver } from './database/driver';
import { IDocumentDatabaseDriver } from './database/nosql/abstraction';
import { CacheClientFactory } from './cache/factory';
import { ICacheClient } from './cache/abstraction';
import { QueueClientFactory } from './queue/factory';
import { IQueueClient } from './queue/abstraction';
import { StructuredLogger, ILogger } from './logger';

export interface ILatticeConfig {
  serviceName: string;
  environment: string;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  database: {
    sql: { type: string; sqlitePath?: string; postgres?: any };
    noSql: { type: string; mongo?: any };
  };
  cache: { type: string; redis?: any };
  queue: { type: string; rabbitmq?: any };
  rateLimit: { windowMs: number; maxRequests: number };
  multitenancy: { strategy: string; headerName: string };
  featureFlags: { [key: string]: boolean };
}

export class LatticeConfigLoader extends ModuleBaseUtility {
  private static readonly logger: ILogger = new StructuredLogger('LatticeConfigLoader');
  private static cachedConfig: ILatticeConfig | null = null;

  public static loadConfig(configPath?: string): ILatticeConfig {
    if (this.cachedConfig) return this.cachedConfig;

    const targetPath = configPath || path.join(process.cwd(), 'config', 'lattice.json');
    try {
      if (fs.existsSync(targetPath)) {
        const fileContent = fs.readFileSync(targetPath, 'utf-8');
        this.cachedConfig = JSON.parse(fileContent) as ILatticeConfig;
        this.logger.info(`Loaded central LatticeConfig from ${targetPath}`);
      } else {
        this.cachedConfig = this.getDefaultConfig();
        this.logger.warn(`Config file not found at ${targetPath}. Falling back to default LatticeConfig.`);
      }
    } catch (err: any) {
      this.logger.error(`Failed to parse LatticeConfig from ${targetPath}: ${err.message}. Using defaults.`);
      this.cachedConfig = this.getDefaultConfig();
    }

    return this.cachedConfig;
  }

  public static initializeDrivers(config?: ILatticeConfig): {
    sqlDriver: IDatabaseDriver;
    noSqlDriver: IDocumentDatabaseDriver;
    cacheClient: ICacheClient;
    queueClient: IQueueClient;
  } {
    const cfg = config || this.loadConfig();

    const sqlDriver = DatabaseDriverFactory.createDriver({
      type: cfg.database.sql.type,
      sqlitePath: cfg.database.sql.sqlitePath,
      postgresConfig: cfg.database.sql.postgres,
    });

    const noSqlDriver = DatabaseDriverFactory.createDocumentDriver({
      type: cfg.database.noSql.type,
      mongoConfig: cfg.database.noSql.mongo,
    });

    const cacheClient = CacheClientFactory.createClient({
      type: cfg.cache.type,
      redisConfig: cfg.cache.redis,
    });

    const queueClient = QueueClientFactory.createClient({
      type: cfg.queue.type,
      rabbitmqConfig: cfg.queue.rabbitmq,
    });

    return { sqlDriver, noSqlDriver, cacheClient, queueClient };
  }

  private static getDefaultConfig(): ILatticeConfig {
    return {
      serviceName: 'LatticeBackend',
      environment: process.env.NODE_ENV || 'development',
      port: Number(process.env.PORT) || 3000,
      apiPrefix: '/api',
      apiVersion: '/v1',
      database: {
        sql: { type: process.env.DATABASE_TYPE || 'sqlite', sqlitePath: ':memory:' },
        noSql: { type: process.env.NOSQL_DATABASE_TYPE || 'in_memory_doc' },
      },
      cache: { type: process.env.CACHE_TYPE || 'in_memory' },
      queue: { type: process.env.QUEUE_TYPE || 'in_memory' },
      rateLimit: { windowMs: 60000, maxRequests: 100 },
      multitenancy: { strategy: 'header_based', headerName: 'x-tenant-id' },
      featureFlags: { enableMetrics: true, enableTracing: true, enableAuditLogging: true },
    };
  }
}
