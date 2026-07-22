import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';

export interface IBackupResult {
  success: boolean;
  backupId: string;
  timestamp: string;
  sizeBytes?: number;
  error?: string;
}

export interface IBackupProvider {
  name: string;
  backup(): Promise<IBackupResult>;
  restore(backupId: string): Promise<boolean>;
}

class BackupHookRegistryClass extends ModuleBaseUtility {
  private readonly providers: IBackupProvider[] = [];
  public readonly logger: ILogger;

  constructor() {
    super();
    this.logger = new StructuredLogger('BackupHookRegistry');
  }

  public register(provider: IBackupProvider): void {
    this.providers.push(provider);
    this.logger.info(`Registered backup provider: ${provider.name}`);
  }

  public async runAll(): Promise<IBackupResult[]> {
    const results: IBackupResult[] = [];
    for (const provider of this.providers) {
      this.logger.info(`Running backup: ${provider.name}`);
      const result = await provider.backup();
      results.push(result);
      if (!result.success) {
        this.logger.error(`Backup failed for provider: ${provider.name}`, result.error);
      }
    }
    return results;
  }

  public async restore(providerName: string, backupId: string): Promise<boolean> {
    const provider = this.providers.find((p) => p.name === providerName);
    if (!provider) {
      this.logger.error(`No backup provider registered with name: ${providerName}`);
      return false;
    }
    return provider.restore(backupId);
  }
}

export const BackupHookRegistry = new BackupHookRegistryClass();

// Built-in placeholder providers
export class DatabaseBackupHook implements IBackupProvider {
  public readonly name = 'database';

  public async backup(): Promise<IBackupResult> {
    // Extension point: implement actual DB dump logic per deployment
    return {
      success: true,
      backupId: `db_backup_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  public async restore(backupId: string): Promise<boolean> {
    // Extension point: implement actual DB restore logic
    return true;
  }
}

export class ConfigurationBackupHook implements IBackupProvider {
  public readonly name = 'configuration';

  public async backup(): Promise<IBackupResult> {
    return {
      success: true,
      backupId: `config_backup_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  public async restore(backupId: string): Promise<boolean> {
    return true;
  }
}
