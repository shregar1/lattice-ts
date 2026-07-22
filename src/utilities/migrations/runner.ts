import { ModuleBaseUtility } from '../abstraction';
import { ILogger, StructuredLogger } from '../logger';

export interface IMigration {
  version: string;
  name: string;
  up(db: any): Promise<void>;
  down(db: any): Promise<void>;
}

export class MigrationRunner extends ModuleBaseUtility {
  public readonly logger: ILogger;
  private readonly executedVersions: Set<string> = new Set();

  constructor(
    private readonly dbClient: any,
    private readonly migrations: IMigration[] = [],
    logger?: ILogger
  ) {
    super();
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  public async runPendingMigrations(): Promise<string[]> {
    const executed: string[] = [];
    for (const migration of this.migrations) {
      if (!this.executedVersions.has(migration.version)) {
        this.logger.info(`Running migration v${migration.version}: ${migration.name}`);
        await migration.up(this.dbClient);
        this.executedVersions.add(migration.version);
        executed.push(migration.version);
      }
    }
    return executed;
  }

  public async rollbackLastMigration(): Promise<string | null> {
    if (this.migrations.length === 0) return null;
    const lastMigration = this.migrations[this.migrations.length - 1];
    if (this.executedVersions.has(lastMigration.version)) {
      this.logger.info(`Rolling back migration v${lastMigration.version}: ${lastMigration.name}`);
      await lastMigration.down(this.dbClient);
      this.executedVersions.delete(lastMigration.version);
      return lastMigration.version;
    }
    return null;
  }

  public getExecutedVersions(): string[] {
    return Array.from(this.executedVersions);
  }
}
