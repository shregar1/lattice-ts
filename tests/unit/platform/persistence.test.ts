import { BaseRepository } from '../../../src/repositories/abstraction';
import { ConcurrencyConflictException } from '../../../src/exceptions/concurrency_conflict';
import { ActiveRecordSpecification } from '../../../src/utilities/specifications/active_record';
import { MigrationRunner } from '../../../src/utilities/migrations/runner';
import { ReferenceDataSeeder } from '../../../src/utilities/seeders/reference_seeder';
import { InMemoryCacheClient } from '../../../src/utilities/cache';

describe('Platform Persistence & Repository Layer Unit Tests', () => {
  test('BaseRepository should support optimistic locking versioning and conflict detection', async () => {
    const dbModel = {
      findById: jest.fn().mockResolvedValue({ id: '1', name: 'Original', version: 1 }),
      update: jest.fn().mockImplementation((id, data) => {
        if (data.version !== 2) {
          throw new ConcurrencyConflictException('Version conflict');
        }
        return { id, ...data, version: 2 };
      }),
    };

    class VersionedRepo extends BaseRepository<any, any, string> {
      constructor() {
        super(dbModel);
      }
      protected mapToEntity(m: any) {
        return m;
      }
      protected mapToModel(e: any) {
        return e;
      }

      public async updateWithLocking(id: string, entity: any, currentVersion: number) {
        const modelData = this.mapToModel(entity);
        if (currentVersion !== 1) {
          throw new ConcurrencyConflictException();
        }
        modelData.version = currentVersion + 1;
        return await this.dbModel.update(id, modelData);
      }
    }

    const repo = new VersionedRepo();
    const updated = await repo.updateWithLocking('1', { name: 'Updated' }, 1);
    expect(updated.version).toBe(2);

    await expect(repo.updateWithLocking('1', { name: 'Conflict' }, 99)).rejects.toThrow(ConcurrencyConflictException);
  });

  test('Specification Pattern should filter active records', () => {
    const spec = new ActiveRecordSpecification<{ is_deleted?: boolean }>();
    expect(spec.isSatisfiedBy({ is_deleted: false })).toBe(true);
    expect(spec.isSatisfiedBy({ is_deleted: true })).toBe(false);

    const criteria = spec.toQueryCriteria();
    expect(criteria.conditions).toEqual([{ field: 'is_deleted', operator: 'eq', value: false }]);
  });

  test('MigrationRunner should execute and rollback migrations', async () => {
    const migration = {
      version: '1.0.0',
      name: 'create_users_table',
      up: jest.fn().mockResolvedValue(undefined),
      down: jest.fn().mockResolvedValue(undefined),
    };

    const runner = new MigrationRunner({}, [migration]);
    const executed = await runner.runPendingMigrations();
    expect(executed).toEqual(['1.0.0']);
    expect(migration.up).toHaveBeenCalled();

    const rolledBack = await runner.rollbackLastMigration();
    expect(rolledBack).toBe('1.0.0');
    expect(migration.down).toHaveBeenCalled();
  });

  test('ReferenceDataSeeder should run idempotently', async () => {
    const mockDb = { upsert: jest.fn().mockResolvedValue(true) };
    const cache = new InMemoryCacheClient();
    const seeder = new ReferenceDataSeeder();

    await seeder.seed(mockDb, cache);
    expect(mockDb.upsert).toHaveBeenCalled();
    const cachedRole = await cache.get('lookup:role:code:admin');
    expect(cachedRole).not.toBeNull();
  });
});
