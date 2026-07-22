import { BaseMigration } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export class MigrationRunner {
  private readonly logger: ILogger = new StructuredLogger('MigrationRunner');
  private migrations: BaseMigration[] = [];

  public register(migration: BaseMigration): void {
    this.migrations.push(migration);
  }

  public async runPending(): Promise<void> {
    for (const migration of this.migrations) {
      this.logger.info(`Running migration ${migration.version}: ${migration.name}`);
      await migration.up();
    }
  }

  public async rollbackLast(): Promise<void> {
    const last = this.migrations.pop();
    if (last) {
      this.logger.info(`Rolling back migration ${last.version}: ${last.name}`);
      await last.down();
    }
  }
}
