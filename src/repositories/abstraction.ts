import { ILogger, StructuredLogger } from '../utilities/logger';

export interface IHasLogger {
  readonly logger: ILogger;
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

export interface IFilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
}

export interface ISortOptions {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface IQueryCriteria {
  conditions?: IFilterCondition[];
  pagination?: IPaginationOptions;
  sort?: ISortOptions[];
}

export interface IQueryResult<TEntity> {
  items: TEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  findByUrn(urn: string): Promise<TEntity | null>;
  findOne(criteria: IQueryCriteria): Promise<TEntity | null>;
  findAll(criteria?: IQueryCriteria): Promise<TEntity[]>;
  findPaginated(criteria: IQueryCriteria): Promise<IQueryResult<TEntity>>;
  create(entity: Partial<TEntity>): Promise<TEntity>;
  createMany(entities: Partial<TEntity>[]): Promise<TEntity[]>;
  update(id: TId, entity: Partial<TEntity>): Promise<TEntity>;
  updateMany(criteria: IQueryCriteria, data: Partial<TEntity>): Promise<number>;
  delete(id: TId): Promise<boolean>;
  softDelete(id: TId): Promise<boolean>;
  restore(id: TId): Promise<boolean>;
  deleteMany(criteria: IQueryCriteria): Promise<number>;
  count(criteria?: IQueryCriteria): Promise<number>;
  exists(criteria: IQueryCriteria): Promise<boolean>;
  existsByUrn(urn: string): Promise<boolean>;
}

export interface IModuleRepository<TEntity, TId = string> extends IBaseRepository<TEntity, TId> {
  // Module-level repository contract
}

export abstract class BaseRepository<TModel, TEntity, TId = string>
  implements IBaseRepository<TEntity, TId>, IHasLogger {
  public readonly logger: ILogger;

  protected constructor(
    protected readonly dbModel: any,
    logger?: ILogger
  ) {
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  public async findById(id: TId): Promise<TEntity | null> {
    const record = await this.dbModel.findById(id);
    return record ? this.mapToEntity(record) : null;
  }

  public async findByUrn(urn: string): Promise<TEntity | null> {
    return await this.findOne({
      conditions: [{ field: 'urn', operator: 'eq', value: urn }],
    });
  }

  public async findOne(criteria: IQueryCriteria): Promise<TEntity | null> {
    const filter = this.buildFilterQuery(criteria);
    const record = await this.dbModel.findOne(filter);
    return record ? this.mapToEntity(record) : null;
  }

  public async findAll(criteria?: IQueryCriteria): Promise<TEntity[]> {
    const filter = criteria ? this.buildFilterQuery(criteria) : {};
    const records = await this.dbModel.find(filter);
    return records.map((r: any) => this.mapToEntity(r));
  }

  public async findPaginated(criteria: IQueryCriteria): Promise<IQueryResult<TEntity>> {
    const filter = this.buildFilterQuery(criteria);
    const page = criteria.pagination?.page || 1;
    const limit = criteria.pagination?.limit || 20;
    const total = await this.count(criteria);
    const items = await this.findAll(criteria);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async create(entity: Partial<TEntity>): Promise<TEntity> {
    const modelData = this.mapToModel(entity);
    const created = await this.dbModel.create(modelData);
    return this.mapToEntity(created);
  }

  public async createMany(entities: Partial<TEntity>[]): Promise<TEntity[]> {
    const modelsData = entities.map((e) => this.mapToModel(e));
    const createdRecords = await this.dbModel.createMany(modelsData);
    return createdRecords.map((r: any) => this.mapToEntity(r));
  }

  public async update(id: TId, entity: Partial<TEntity>): Promise<TEntity> {
    const modelData = this.mapToModel(entity);
    const updated = await this.dbModel.update(id, modelData);
    return this.mapToEntity(updated);
  }

  public async updateMany(criteria: IQueryCriteria, data: Partial<TEntity>): Promise<number> {
    const filter = this.buildFilterQuery(criteria);
    const modelData = this.mapToModel(data);
    return await this.dbModel.updateMany(filter, modelData);
  }

  public async delete(id: TId): Promise<boolean> {
    return await this.dbModel.delete(id);
  }

  public async softDelete(id: TId): Promise<boolean> {
    return await this.dbModel.update(id, { is_deleted: true, deleted_at: new Date() });
  }

  public async restore(id: TId): Promise<boolean> {
    return await this.dbModel.update(id, { is_deleted: false, deleted_at: null });
  }

  public async deleteMany(criteria: IQueryCriteria): Promise<number> {
    const filter = this.buildFilterQuery(criteria);
    return await this.dbModel.deleteMany(filter);
  }

  public async count(criteria?: IQueryCriteria): Promise<number> {
    const filter = criteria ? this.buildFilterQuery(criteria) : {};
    return await this.dbModel.count(filter);
  }

  public async exists(criteria: IQueryCriteria): Promise<boolean> {
    const count = await this.count(criteria);
    return count > 0;
  }

  public async existsByUrn(urn: string): Promise<boolean> {
    return await this.exists({
      conditions: [{ field: 'urn', operator: 'eq', value: urn }],
    });
  }

  protected buildFilterQuery(criteria: IQueryCriteria): Record<string, any> {
    const filterQuery: Record<string, any> = {};
    if (!criteria.conditions || criteria.conditions.length === 0) {
      return filterQuery;
    }

    for (const condition of criteria.conditions) {
      switch (condition.operator) {
        case 'eq':
          filterQuery[condition.field] = condition.value;
          break;
        case 'neq':
          filterQuery[condition.field] = { $ne: condition.value };
          break;
        case 'gt':
          filterQuery[condition.field] = { $gt: condition.value };
          break;
        case 'gte':
          filterQuery[condition.field] = { $gte: condition.value };
          break;
        case 'lt':
          filterQuery[condition.field] = { $lt: condition.value };
          break;
        case 'lte':
          filterQuery[condition.field] = { $lte: condition.value };
          break;
        case 'in':
          filterQuery[condition.field] = { $in: condition.value };
          break;
        case 'nin':
          filterQuery[condition.field] = { $nin: condition.value };
          break;
        case 'contains':
          filterQuery[condition.field] = { $regex: condition.value, $options: 'i' };
          break;
        case 'startsWith':
          filterQuery[condition.field] = { $regex: `^${condition.value}`, $options: 'i' };
          break;
        case 'endsWith':
          filterQuery[condition.field] = { $regex: `${condition.value}$`, $options: 'i' };
          break;
        default:
          filterQuery[condition.field] = condition.value;
      }
    }

    return filterQuery;
  }

  protected abstract mapToEntity(model: TModel): TEntity;
  protected abstract mapToModel(entity: Partial<TEntity>): TModel;
}
