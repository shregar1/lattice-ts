import { BaseSpecification, ISpecification } from './abstraction';
import { IQueryCriteria } from '../../repositories/abstraction';

export class AndSpecification<TEntity> extends BaseSpecification<TEntity> {
  constructor(private left: ISpecification<TEntity>, private right: ISpecification<TEntity>) {
    super();
  }

  public isSatisfiedBy(entity: TEntity): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
  }

  public toQueryCriteria(): IQueryCriteria {
    const leftCriteria = this.left.toQueryCriteria();
    const rightCriteria = this.right.toQueryCriteria();
    return {
      conditions: [...(leftCriteria.conditions || []), ...(rightCriteria.conditions || [])],
    };
  }
}
