# 06 — Service Layer & Business Logic Isolation

> **Lattice Core Blueprint** — Single-capability domain services and business rule enforcement.

---

## 1. Service Layer Rules

1. **Single Capability Focus**: A service encapsulates one specific domain capability (e.g. `UserService`, `AuthService`, `PaymentService`).
2. **Interface-Driven Repositories**: Services access repositories exclusively via interfaces (`IUserRepository`).
3. **No Direct Model Access**: Services operate on entity interfaces or DTOs, never directly instantiating raw DB ORM models.
4. **No Transaction Control**: Services never call `commit()`, `rollback()`, or manage DB transactions.

---

## 2. Service Performance Telemetry

All public service methods are annotated with performance measurement decorators (`@MeasurePerformance('service')`) to automatically log execution metrics into `RequestContext`.
