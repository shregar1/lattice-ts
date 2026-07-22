import { BaseConfiguration } from '../abstractions/configuration';
import {
  AppConfigDTO,
  DatabaseConfigDTO,
  AuthConfigDTO,
  LoggingConfigDTO,
  CacheConfigDTO,
  StorageConfigDTO,
  EmailConfigDTO,
  RateLimitConfigDTO,
} from '../dto/configurations/config_dtos';

import appJson from './app/config.json';
import dbJson from './db/config.json';
import cacheJson from './cache/config.json';
import authJson from './auth/config.json';
import loggingJson from './logging/config.json';
import storageJson from './storage/config.json';
import emailJson from './email/config.json';

export class ConfigurationProvider extends BaseConfiguration {
  private static instance: ConfigurationProvider | null = null;

  private readonly appConfig: AppConfigDTO;
  private readonly databaseConfig: DatabaseConfigDTO;
  private readonly authConfig: AuthConfigDTO;
  private readonly loggingConfig: LoggingConfigDTO;
  private readonly cacheConfig: CacheConfigDTO;
  private readonly storageConfig: StorageConfigDTO;
  private readonly emailConfig: EmailConfigDTO;
  private readonly rateLimitConfig: RateLimitConfigDTO;

  private constructor() {
    super();

    const env = process.env.NODE_ENV || appJson.env;

    this.appConfig = new AppConfigDTO(
      process.env.APP_NAME || appJson.name,
      env,
      parseInt(process.env.PORT || String(appJson.port), 10),
      process.env.API_VERSION || appJson.apiVersion
    );

    this.databaseConfig = new DatabaseConfigDTO(
      process.env.DB_HOST || dbJson.host,
      parseInt(process.env.DB_PORT || String(dbJson.port), 10),
      process.env.DB_NAME || dbJson.name,
      process.env.DB_USER || dbJson.user,
      process.env.DB_PASSWORD || dbJson.pass,
      parseInt(process.env.DB_POOL_SIZE || String(dbJson.poolSize), 10)
    );

    this.authConfig = new AuthConfigDTO(
      process.env.JWT_SECRET || authJson.jwtSecret,
      parseInt(process.env.JWT_EXPIRATION || String(authJson.jwtExpiration), 10),
      authJson.saltRounds
    );

    this.loggingConfig = new LoggingConfigDTO(
      process.env.LOG_LEVEL || loggingJson.level
    );

    this.cacheConfig = new CacheConfigDTO(
      process.env.CACHE_PROVIDER || cacheJson.provider,
      process.env.REDIS_HOST || cacheJson.host,
      parseInt(process.env.REDIS_PORT || String(cacheJson.port), 10),
      cacheJson.defaultTtl
    );

    this.storageConfig = new StorageConfigDTO(
      process.env.STORAGE_PROVIDER || storageJson.provider,
      process.env.STORAGE_BUCKET || storageJson.bucket,
      process.env.STORAGE_BASE_PATH || storageJson.basePath
    );

    this.emailConfig = new EmailConfigDTO(
      process.env.EMAIL_HOST || emailJson.host,
      parseInt(process.env.EMAIL_PORT || String(emailJson.port), 10),
      process.env.EMAIL_FROM || emailJson.from
    );

    this.rateLimitConfig = new RateLimitConfigDTO(15 * 60 * 1000, 100);
  }

  public static getInstance(): ConfigurationProvider {
    if (!this.instance) {
      this.instance = new ConfigurationProvider();
    }
    return this.instance;
  }

  public getAppConfig(): AppConfigDTO {
    return this.appConfig;
  }

  public getDatabaseConfig(): DatabaseConfigDTO {
    return this.databaseConfig;
  }

  public getAuthConfig(): AuthConfigDTO {
    return this.authConfig;
  }

  public getLoggingConfig(): LoggingConfigDTO {
    return this.loggingConfig;
  }

  public getCacheConfig(): CacheConfigDTO {
    return this.cacheConfig;
  }

  public getStorageConfig(): StorageConfigDTO {
    return this.storageConfig;
  }

  public getEmailConfig(): EmailConfigDTO {
    return this.emailConfig;
  }

  public getRateLimitConfig(): RateLimitConfigDTO {
    return this.rateLimitConfig;
  }
}
