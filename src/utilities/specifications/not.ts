import { BaseSpecification, ISpecification } from './abstraction';
import { IQueryCriteria } from '../../repositories/abstraction';

export class NotSpecification<TEntity> extends BaseSpecification<TEntity> {
  constructor(private spec: ISpecification<TEntity>) {
    super();
  }

  public isSatisfiedBy(entity: TEntity): boolean {
    return !this.spec.isSatisfiedBy(entity);
  }

  public toQueryCriteria(): IQueryCriteria {
    const criteria = this.spec.toQueryCriteria();
    return {
      conditions: (criteria.conditions || []).map((c: any) => ({
        ...c,
        operator: c.operator === 'eq' ? 'neq' : 'eq',
      })),
    };
  }
}
