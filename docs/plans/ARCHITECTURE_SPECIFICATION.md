# Lattice Universal Architecture Specification

> **Lattice** is an enterprise-grade backend template suite for building production systems across TypeScript, Go, Rust, Python, and Ruby.
>
> All Lattice implementations across all languages follow the exact same 15-stage middleware pipeline, 5-layer separation of concerns, and design patterns.

---

## 1. Core Architectural Pipeline

```
HTTP Request
      │
      ▼
Middleware Pipeline (15 Stages)
      │
      ▼
Controllers          ← Thin HTTP handler (maps route, returns envelope)
      │
      ▼
Orchestrators        ← Multi-service workflow & Unit of Work (Transaction boundary)
      │
      ▼
Services            ← Single-capability business logic
      │
      ▼
Repositories        ← Persistence abstraction & lookup caching
      │
      ▼
Database Models     ← Pure entity & schema definitions
```

---

## 2. The 15 Middleware Stages

Every incoming request passes through these 15 stages in order before entering any Controller:

| Stage | Middleware | Description |
|---|---|---|
| 1 | **ExceptionHandler** | Global try-catch boundary; formats all unhandled errors into standard response envelope |
| 2 | **TrustedHost** | Rejects requests with unapproved `Host` headers |
| 3 | **SecurityHeaders** | Injects OWASP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `CSP`, `HSTS`) |
| 4 | **Cors** | Enforces CORS origins, methods, and allowed headers |
| 5 | **Compression** | Gzip / Deflate response compression for payloads > threshold |
| 6 | **RequestTimeout** | Aborts long-running requests exceeding configured threshold (e.g. 10s) |
| 7 | **RequestContext** | Generates `requestUrn`, `correlationId`, tracks `startTime`, client IP, user agent |
| 8 | **RequestLogger** | Emits structured JSON log entry for request receipt and completion |
| 9 | **RateLimit** | Sliding-window or token-bucket rate limiter per IP/client |
| 10 | **Authentication** | Validates Bearer JWT; populates `userId`, `roles`, `permissions` into RequestContext |
| 11 | **TenantResolution** | Resolves `tenantId` from header, subdomain, or JWT claim; enforces isolation |
| 12 | **Authorization** | Enforces role-based / permission-based access control against target route |
| 13 | **RequestValidation** | Intercepts request and validates payload against schema (Zod/Pydantic/Validator) *before* controller entry |
| 14 | **ResponseBuilder** | Wraps successful response data in standard `BaseResponseEnvelope` |
| 15 | **AuditLogger** | Publishes structured audit log entries for state-changing operations |

---

## 3. The 5 Architectural Layers & Rules

### Layer 1: Controller
- **Responsibility**: Map HTTP endpoint to Orchestrator execution. Return standardized response envelope.
- **Rules**: Thin layer only. No business rules, no direct repository access, no direct database queries. Validation is performed upstream at Stage 13.

### Layer 2: Orchestrator
- **Responsibility**: Coordinate multi-service workflows. Manage Unit of Work (UoW) transaction boundaries (`beginTransaction`, `commit`, `rollback`). Emit domain events.
- **Rules**: No raw SQL/ORMs, no HTTP concerns. Never access repositories directly — call services.

### Layer 3: Service
- **Responsibility**: Single domain capability (e.g. `UserService`, `EmailService`).
- **Rules**: Communicate with Repositories through interfaces. Never access database models directly. Never manage transactions or call `commit()`.

### Layer 4: Repository
- **Responsibility**: Persistence abstraction (CRUD, specifications, paginated queries, soft delete).
- **Rules**: Pure persistence. No business logic. No transaction management. Lookup repositories must implement repository-level caching.

### Layer 5: Database Model
- **Responsibility**: Entity & schema definitions.
- **Rules**: Pure data structures. No behavior or dependency references.

---

## 4. Standard Response Envelope Contract

All Lattice endpoints across all languages return this standardized JSON response format:

```json
{
  "transactionUrn": "urn:req:123456789",
  "status": "SUCCESS",
  "responseMessage": "Operation completed successfully",
  "responseKey": "RESOURCE_CREATED",
  "errors": [],
  "timestamp": "2026-07-22T22:50:00.000Z",
  "metadata": {},
  "data": { ... },
  "referenceUrn": "urn:ref:987654321"
}
```

---

## 5. Multi-Language Implementations

- **TypeScript**: [`lattice-ts`](https://github.com/shregar1/lattice-ts)
- **Go**: [`lattice-go`](GO_IMPLEMENTATION_PLAN.md)
- **Rust**: [`lattice-rs`](RUST_IMPLEMENTATION_PLAN.md)
- **Python**: [`lattice-py`](PYTHON_IMPLEMENTATION_PLAN.md)
- **Ruby**: [`lattice-rb`](RUBY_IMPLEMENTATION_PLAN.md)
