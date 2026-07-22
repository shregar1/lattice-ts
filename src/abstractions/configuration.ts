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

export interface IConfiguration {
  getAppConfig(): AppConfigDTO;
  getDatabaseConfig(): DatabaseConfigDTO;
  getAuthConfig(): AuthConfigDTO;
  getLoggingConfig(): LoggingConfigDTO;
  getCacheConfig(): CacheConfigDTO;
  getStorageConfig(): StorageConfigDTO;
  getEmailConfig(): EmailConfigDTO;
  getRateLimitConfig(): RateLimitConfigDTO;
}

export abstract class BaseConfiguration implements IConfiguration {
  public abstract getAppConfig(): AppConfigDTO;
  public abstract getDatabaseConfig(): DatabaseConfigDTO;
  public abstract getAuthConfig(): AuthConfigDTO;
  public abstract getLoggingConfig(): LoggingConfigDTO;
  public abstract getCacheConfig(): CacheConfigDTO;
  public abstract getStorageConfig(): StorageConfigDTO;
  public abstract getEmailConfig(): EmailConfigDTO;
  public abstract getRateLimitConfig(): RateLimitConfigDTO;
}
