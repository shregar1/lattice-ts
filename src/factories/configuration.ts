import { ModuleBaseFactory } from './abstraction';
import { ConfigurationProvider } from '../configuration/config.provider';
import { AppConfigDTO, DatabaseConfigDTO, AuthConfigDTO, LoggingConfigDTO, CacheConfigDTO, StorageConfigDTO, EmailConfigDTO } from '../dto/configurations/config_dtos';

export class ConfigurationFactory extends ModuleBaseFactory<any> {
  public create(type?: string): any {
    const provider = ConfigurationProvider.getInstance();
    switch (type) {
      case 'app':
        return provider.getAppConfig();
      case 'database':
        return provider.getDatabaseConfig();
      case 'auth':
        return provider.getAuthConfig();
      case 'logging':
        return provider.getLoggingConfig();
      case 'cache':
        return provider.getCacheConfig();
      case 'storage':
        return provider.getStorageConfig();
      case 'email':
        return provider.getEmailConfig();
      default:
        return provider;
    }
  }

  public getAppConfig(): AppConfigDTO {
    return ConfigurationProvider.getInstance().getAppConfig();
  }

  public getDatabaseConfig(): DatabaseConfigDTO {
    return ConfigurationProvider.getInstance().getDatabaseConfig();
  }

  public getAuthConfig(): AuthConfigDTO {
    return ConfigurationProvider.getInstance().getAuthConfig();
  }

  public getLoggingConfig(): LoggingConfigDTO {
    return ConfigurationProvider.getInstance().getLoggingConfig();
  }

  public getCacheConfig(): CacheConfigDTO {
    return ConfigurationProvider.getInstance().getCacheConfig();
  }

  public getStorageConfig(): StorageConfigDTO {
    return ConfigurationProvider.getInstance().getStorageConfig();
  }

  public getEmailConfig(): EmailConfigDTO {
    return ConfigurationProvider.getInstance().getEmailConfig();
  }
}
