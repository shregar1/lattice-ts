# 09 — Unit of Work & Transaction Management

> **Lattice Core Blueprint** — Transaction boundaries, isolation, and rollback safety.

---

## 1. The Unit of Work Contract (`IUnitOfWork`)

```typescript
export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  executeInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
```

---

## 2. Execution Flow & Guardrails

```typescript
public async executeInTransaction<T>(work: () => Promise<T>): Promise<T> {
  await this.beginTransaction();
  try {
    const result = await work();
    await this.commit();
    return result;
  } catch (error) {
    await this.rollback();
    throw error;
  }
}
```
