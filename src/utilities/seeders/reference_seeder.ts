import { ModuleBaseUtility } from '../abstraction';
import { ICacheClient } from '../cache';
import { ILogger, StructuredLogger } from '../logger';

export interface ISeeder {
  name: string;
  seed(db: any, cacheClient?: ICacheClient): Promise<void>;
}

export class ReferenceDataSeeder extends ModuleBaseUtility implements ISeeder {
  public name = 'ReferenceDataSeeder';
  public readonly logger: ILogger;

  constructor(logger?: ILogger) {
    super();
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  public async seed(db: any, cacheClient?: ICacheClient): Promise<void> {
    const roles = [
      { id: 'r_admin', code: 'ADMIN', name: 'Administrator', is_active: true },
      { id: 'r_user', code: 'USER', name: 'Standard User', is_active: true },
    ];

    const countries = [
      { id: 'c_us', code: 'US', name: 'United States', is_active: true },
      { id: 'c_in', code: 'IN', name: 'India', is_active: true },
    ];

    // Idempotent upsert seeding logic
    for (const role of roles) {
      if (db.upsert) {
        await db.upsert('roles', role, { key: 'code' });
      }
      if (cacheClient) {
        await cacheClient.set(`lookup:role:code:${role.code.toLowerCase()}`, role, 3600);
      }
    }

    for (const country of countries) {
      if (db.upsert) {
        await db.upsert('countries', country, { key: 'code' });
      }
      if (cacheClient) {
        await cacheClient.set(`lookup:country:code:${country.code.toLowerCase()}`, country, 3600);
      }
    }

    this.logger.info('Reference data seeding completed idempotently.');
  }
}
