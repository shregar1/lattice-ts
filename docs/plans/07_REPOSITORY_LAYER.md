# 07 — Repository Layer, Specifications & Persistence

> **Lattice Core Blueprint** — Generic persistence abstraction, query criteria, and soft deletes.

---

## 1. Core Repository Interface (`IBaseRepository`)

```typescript
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
}
```

---

## 2. Specification Pattern Integration

Composable specifications (`BaseSpecification`, `AndSpecification`, `OrSpecification`, `NotSpecification`) allow clean, dynamic query building without exposing ORM query details:

```typescript
const spec = new ActiveRecordSpecification().and(new OwnerSpecification(ownerId));
const results = await repository.findAll(spec.toQueryCriteria());
```
