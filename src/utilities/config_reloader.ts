import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';
import { EventBusUtility } from './events';

export interface IConfigurationProvider {
  name: string;
  load(): Promise<Record<string, any>>;
}

class DynamicConfigurationRegistryClass extends ModuleBaseUtility {
  private readonly providers: IConfigurationProvider[] = [];
  private cache = new Map<string, any>();
  private reloadIntervalId?: NodeJS.Timeout;
  public readonly logger: ILogger;

  constructor() {
    super();
    this.logger = new StructuredLogger('DynamicConfigurationRegistry');
  }

  public register(provider: IConfigurationProvider): void {
    this.providers.push(provider);
    this.logger.info(`Registered configuration provider: ${provider.name}`);
  }

  /** Load all providers and cache values */
  public async loadAll(): Promise<void> {
    for (const provider of this.providers) {
      try {
        const values = await provider.load();
        for (const [k, v] of Object.entries(values)) {
          this.cache.set(k, v);
        }
      } catch (err: any) {
        this.logger.error(`Failed to load configuration from provider: ${provider.name}`, err);
      }
    }
    await EventBusUtility.publish('config.reloaded', { timestamp: new Date().toISOString() });
  }

  public get<T = any>(key: string, defaultValue?: T): T | undefined {
    return this.cache.has(key) ? this.cache.get(key) : defaultValue;
  }

  /** Start polling for configuration reloads */
  public startPolling(intervalMs: number = 60_000): void {
    if (this.reloadIntervalId) return;
    this.reloadIntervalId = setInterval(() => this.loadAll(), intervalMs);
    this.logger.info(`Configuration reloading started every ${intervalMs}ms`);
  }

  public stopPolling(): void {
    if (this.reloadIntervalId) {
      clearInterval(this.reloadIntervalId);
      this.reloadIntervalId = undefined;
    }
  }
}

export const DynamicConfigurationRegistry = new DynamicConfigurationRegistryClass();

/** Built-in .env provider — reads process.env */
export class EnvConfigurationProvider implements IConfigurationProvider {
  public readonly name = 'env';

  public async load(): Promise<Record<string, any>> {
    return { ...process.env };
  }
}
