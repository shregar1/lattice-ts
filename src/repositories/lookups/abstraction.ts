import { BaseRepository } from '../abstraction';
import { IBaseRepository, IQueryCriteria } from '../abstraction';
import { ICacheClient } from '../../utilities/cache';
import { ILookupModel } from '../../models/lookup';

export interface ILookupRepository<T extends ILookupModel> {
  findByCode(code: string): Promise<T | null>;
  getAllActive(): Promise<T[]>;
  clearCache(): Promise<void>;
}

export class GenericLookupRepository<T extends ILookupModel>
  extends BaseRepository<any, T, string>
  implements ILookupRepository<T> {
  private readonly cacheKeyPrefix: string;

  constructor(
    dbModel: any,
    private readonly cacheClient: ICacheClient,
    entityName: string,
    private readonly ttlSeconds: number = 3600
  ) {
    super(dbModel);
    this.cacheKeyPrefix = `lookup:${entityName.toLowerCase()}:`;
  }

  public async findByCode(code: string): Promise<T | null> {
    const cacheKey = `${this.cacheKeyPrefix}code:${code.toLowerCase()}`;
    const cached = await this.cacheClient.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const criteria: IQueryCriteria = {
      conditions: [{ field: 'code', operator: 'eq', value: code }],
    };
    const entity = await this.findOne(criteria);
    if (entity) {
      await this.cacheClient.set(cacheKey, entity, this.ttlSeconds);
    }
    return entity;
  }

  public async getAllActive(): Promise<T[]> {
    const cacheKey = `${this.cacheKeyPrefix}all_active`;
    const cached = await this.cacheClient.get<T[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const criteria: IQueryCriteria = {
      conditions: [{ field: 'isActive', operator: 'eq', value: true }],
    };
    const items = await this.findAll(criteria);
    await this.cacheClient.set(cacheKey, items, this.ttlSeconds);
    return items;
  }

  public async clearCache(): Promise<void> {
    await this.cacheClient.delete(`${this.cacheKeyPrefix}all_active`);
  }

  protected mapToEntity(model: any): T {
    return {
      id: model.id,
      code: model.code,
      name: model.name,
      description: model.description,
      isActive: model.is_active ?? model.isActive ?? true,
    } as T;
  }

  protected mapToModel(entity: Partial<T>): any {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
    };
  }
}
