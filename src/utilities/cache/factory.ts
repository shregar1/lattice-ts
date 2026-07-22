import { ICacheClient } from './abstraction';
import { InMemoryCacheDriver } from './in_memory_driver';
import { RedisCacheDriver, IRedisConfig } from './redis_driver';

export type CacheDriverType = 'in_memory' | 'memory' | 'redis' | string;

export interface ICacheConfig {
  type?: CacheDriverType;
  redisConfig?: IRedisConfig;
  customClient?: ICacheClient;
}

export class CacheClientFactory {
  public static createClient(config: ICacheConfig = {}): ICacheClient {
    if (config.customClient) {
      return config.customClient;
    }

    const type = (config.type || process.env.CACHE_TYPE || 'in_memory').toLowerCase();

    switch (type) {
      case 'redis':
        return new RedisCacheDriver(config.redisConfig);
      case 'in_memory':
      case 'memory':
      default:
        return new InMemoryCacheDriver();
    }
  }
}
