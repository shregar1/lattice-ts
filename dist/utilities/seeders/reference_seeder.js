"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceDataSeeder = void 0;
const abstraction_1 = require("../abstraction");
const logger_1 = require("../logger");
class ReferenceDataSeeder extends abstraction_1.ModuleBaseUtility {
    name = 'ReferenceDataSeeder';
    logger;
    constructor(logger) {
        super();
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    async seed(db, cacheClient) {
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
exports.ReferenceDataSeeder = ReferenceDataSeeder;
