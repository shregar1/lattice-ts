import { BaseSpecification } from './abstraction';
import { IQueryCriteria } from '../../repositories/abstraction';

export class ActiveRecordSpecification<TEntity extends { is_deleted?: boolean }> extends BaseSpecification<TEntity> {
  public isSatisfiedBy(entity: TEntity): boolean {
    return !entity.is_deleted;
  }

  public toQueryCriteria(): IQueryCriteria {
    return {
      conditions: [{ field: 'is_deleted', operator: 'eq', value: false }],
    };
  }
}
