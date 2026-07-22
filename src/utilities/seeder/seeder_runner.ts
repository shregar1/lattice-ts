import { BaseSeeder } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export class SeederRunner {
  private readonly logger: ILogger = new StructuredLogger('SeederRunner');
  private seeders: BaseSeeder[] = [];

  public register(seeder: BaseSeeder): void {
    this.seeders.push(seeder);
  }

  public async runAll(): Promise<void> {
    for (const seeder of this.seeders) {
      this.logger.info(`Running seeder: ${seeder.name}`);
      await seeder.seed();
    }
    this.logger.info('Reference data seeding completed idempotently.');
  }
}
