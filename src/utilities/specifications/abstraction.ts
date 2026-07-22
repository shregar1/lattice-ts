import { ModuleBaseUtility } from '../abstraction';
import { IQueryCriteria } from '../../repositories/abstraction';

export interface ISpecification<TEntity> {
  isSatisfiedBy(entity: TEntity): boolean;
  toQueryCriteria(): IQueryCriteria;
  and(other: ISpecification<TEntity>): ISpecification<TEntity>;
  or(other: ISpecification<TEntity>): ISpecification<TEntity>;
  not(): ISpecification<TEntity>;
}

export abstract class BaseSpecification<TEntity> extends ModuleBaseUtility implements ISpecification<TEntity> {
  public abstract isSatisfiedBy(entity: TEntity): boolean;
  public abstract toQueryCriteria(): IQueryCriteria;

  public and(other: ISpecification<TEntity>): ISpecification<TEntity> {
    const { AndSpecification } = require('./and');
    return new AndSpecification(this, other);
  }

  public or(other: ISpecification<TEntity>): ISpecification<TEntity> {
    const { OrSpecification } = require('./or');
    return new OrSpecification(this, other);
  }

  public not(): ISpecification<TEntity> {
    const { NotSpecification } = require('./not');
    return new NotSpecification(this);
  }
}
