import { BaseValidator } from '../../../src/utilities/validator';
import { BaseMapper } from '../../../src/utilities/mapper';
import { GenericLookupRepository } from '../../../src/repositories/lookups/abstraction';
import { ILookupModel } from '../../../src/models/lookup';
import { InMemoryCacheClient } from '../../../src/utilities/cache';

interface TestRoleModel extends ILookupModel {}

describe('Platform Architecture & Utilities Unit Tests', () => {
  test('BaseValidator should validate UUID, Email, and Phone formats', () => {
    expect(BaseValidator.isUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(BaseValidator.isUuid('invalid-uuid')).toBe(false);

    expect(BaseValidator.isEmail('user@domain.com')).toBe(true);
    expect(BaseValidator.isEmail('invalid-email')).toBe(false);

    expect(BaseValidator.isPhone('+14155552671')).toBe(true);
  });

  test('BaseMapper mapArray should correctly map items', () => {
    class DummyMapper extends BaseMapper<number, string> {
      public map(source: number): string {
        return `item_${source}`;
      }
    }

    const mapper = new DummyMapper();
    expect(mapper.mapArray([1, 2, 3])).toEqual(['item_1', 'item_2', 'item_3']);
  });

  test('GenericLookupRepository should cache lookup results', async () => {
    const mockModel = {
      findOne: jest.fn().mockResolvedValue({ id: 'r_1', code: 'ADMIN', name: 'Administrator', is_active: true }),
      find: jest.fn().mockResolvedValue([{ id: 'r_1', code: 'ADMIN', name: 'Administrator', is_active: true }]),
    };
    const cache = new InMemoryCacheClient();
    const repository = new GenericLookupRepository<TestRoleModel>(mockModel, cache, 'Role');

    // First call fetches from DB
    const role1 = await repository.findByCode('ADMIN');
    expect(role1?.code).toBe('ADMIN');
    expect(mockModel.findOne).toHaveBeenCalledTimes(1);

    // Second call fetches from cache
    const role2 = await repository.findByCode('ADMIN');
    expect(role2?.code).toBe('ADMIN');
    expect(mockModel.findOne).toHaveBeenCalledTimes(1); // Cached, no second DB call
  });
});
