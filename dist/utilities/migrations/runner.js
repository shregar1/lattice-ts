"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRunner = void 0;
const abstraction_1 = require("../abstraction");
const logger_1 = require("../logger");
class MigrationRunner extends abstraction_1.ModuleBaseUtility {
    dbClient;
    migrations;
    logger;
    executedVersions = new Set();
    constructor(dbClient, migrations = [], logger) {
        super();
        this.dbClient = dbClient;
        this.migrations = migrations;
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    async runPendingMigrations() {
        const executed = [];
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
    async rollbackLastMigration() {
        if (this.migrations.length === 0)
            return null;
        const lastMigration = this.migrations[this.migrations.length - 1];
        if (this.executedVersions.has(lastMigration.version)) {
            this.logger.info(`Rolling back migration v${lastMigration.version}: ${lastMigration.name}`);
            await lastMigration.down(this.dbClient);
            this.executedVersions.delete(lastMigration.version);
            return lastMigration.version;
        }
        return null;
    }
    getExecutedVersions() {
        return Array.from(this.executedVersions);
    }
}
exports.MigrationRunner = MigrationRunner;
