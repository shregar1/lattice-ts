import {
  IBaseRepository,
  IModuleRepository,
  IQueryCriteria,
  IQueryResult,
} from '../repositories/abstraction';

export interface IBaseRepositoryInterface<TEntity, TId = string> extends IBaseRepository<TEntity, TId> {}
