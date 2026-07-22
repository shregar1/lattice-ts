# 05 — Orchestrator Layer & Transaction Boundary

> **Lattice Core Blueprint** — Multi-service workflow coordination and Unit of Work management.

---

## 1. Orchestrator Responsibilities

Orchestrators sit between Controllers and Services. Their sole responsibilities are:
1. Coordinate multi-service domain workflows.
2. Establish Unit of Work transaction boundaries (`executeInTransaction`).
3. Handle commit & rollback lifecycle automatically.
4. Emit domain events via `EventBusUtility` upon transaction completion.

---

## 2. Transaction Boundary Guardrails

```
Controller
    │
    ▼
Orchestrator ────► [Begin Transaction]
    │                     │
    ├─────► Service A ────┤  All operations share same DB Session / Tx
    ├─────► Service B ────┤
    │                     │
    └────► [Commit / Rollback Transaction]
```

- **Rule 1**: Only Orchestrators open transactions.
- **Rule 2**: Read-only lookups are performed *before* opening a transaction to reduce lock holding time.
- **Rule 3**: If any service throws an exception, the Unit of Work automatically rolls back all changes.
