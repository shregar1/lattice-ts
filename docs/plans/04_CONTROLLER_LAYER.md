# 04 — Controller Layer & Hierarchical Routing

> **Lattice Core Blueprint** — Thin controller principles, hierarchical route trees, and standardized response envelopes.

---

## 1. Controller Principles

1. **Thin Execution**: Controllers map incoming request context to Orchestrator methods and format responses.
2. **Zero Business Rules**: Controllers never evaluate business logic, conditions, or database models.
3. **No Direct Service or Repository Access**: Controllers only interact with Orchestrators.
4. **No Manual Validation**: Validation is executed upstream at Stage 13 (`RequestValidationMiddleware`).

---

## 2. Hierarchical Router Architecture (`routes.ts`)

Controllers are wired via nested routers at every directory level:

```
src/controllers/
├── routes.ts                        ← Root Application Router (mounts '/api')
└── api/
    ├── routes.ts                    ← API Router (mounts '/v1')
    └── v1/
        ├── routes.ts                ← V1 Router (mounts '/auth', '/platform')
        ├── auth/
        │   ├── routes.ts            ← Feature Router (POST '/register', POST '/login')
        │   ├── register.ts
        │   └── login.ts
        └── platform/
            ├── routes.ts            ← Feature Router (GET '/health', etc.)
            └── health.ts
```

---

## 3. Standard Response Envelope Contract

```typescript
export class BaseResponseEnvelopeDTO<TData = any> {
  public readonly transactionUrn: string;
  public readonly status: 'SUCCESS' | 'FAILED';
  public readonly responseMessage: string;
  public readonly responseKey: string;
  public readonly errors: any[];
  public readonly timestamp: string;
  public readonly metadata: Record<string, any>;
  public readonly data: TData;
  public readonly referenceUrn: string;
}
```
