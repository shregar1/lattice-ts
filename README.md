# Lattice (TypeScript Edition) 🚀

> **Enterprise-Grade, Multi-Language Microservice & Backend Framework Scaffold**  
> *Under the `shregar1` open-source organization on GitHub.*

---

## 🌟 Production-Grade Pillars

Lattice is engineered to tier-1 enterprise standards (equivalent to Google, Netflix, and Uber backend architecture benchmarks) and is battle-tested for security, high performance, and horizontal scalability:

### 1. 🏗️ Architectural Rigor & Clean Code
- **Strict Layer Separation**: `Controller` $\rightarrow$ `DTO` $\rightarrow$ `Orchestrator` $\rightarrow$ `Service` $\rightarrow$ `Repository` $\rightarrow$ `Database Driver`.
- **Unit of Work Transaction Management**: Repositories and Services never call `commit()` or `rollback()`. Transaction boundaries are owned exclusively by `Orchestrator` via `unitOfWork.executeInTransaction()`.
- **Mandatory DTO Inter-Layer Data Transfer**: Raw untyped JSON is never passed across layer boundaries. All data transfer uses strongly-typed DTOs.
- **Dependency Injection**: Awilix container managing singleton and scoped request dependencies.
- **Instant Domain Generation**: `npm run generate:module <Entity>` creates complete, decoupled domain modules in **2 seconds**.

### 2. 🛡️ Security & Resilience
- **15-Stage Pipeline Middleware**: Upstream payload validation at Stage 13 (`RequestValidationMiddleware`) eliminates SQL injection, XSS, and mass-assignment risks before controller entry.
- **OWASP Hardening**: Stage 3 (`SecurityHeadersMiddleware`) injects `Content-Security-Policy`, `HSTS`, `X-Frame-Options`, and `X-Content-Type-Options`.
- **DDoS & Spam Protection**: Stage 9 sliding-window rate limiter + `IdempotencyService` request deduplication.
- **Fault Tolerance**: `RetryPolicy` with exponential backoff + random jitter for external dependencies.

### 3. ⚡ High Performance & Low Latency
- **Non-Blocking Asynchronous Pipeline**: 15-stage middleware pipeline running asynchronously without blocking event loops.
- **Cache-First Lookup Strategy**: `GenericLookupRepository` serves lookups from cache (`lookup:{entity}:code:{code}`) and invalidates cache automatically on writes.
- **Performance Instrumentation**: `@MeasurePerformance('controller')` microsecond execution duration monitoring.
- **Optimized Connection Pools**: Thread-safe pool management for Postgres, MongoDB, Redis, and RabbitMQ.

### 4. 📈 Horizontal Scalability & Observability
- **Stateless Microservice Architecture**: Stateless JWT authentication & correlation tracing (`X-Correlation-ID`, `X-Request-ID`) across distributed worker nodes.
- **Enterprise Observability**: Built-in OpenTelemetry span tracing (`tracing.ts`) + Prometheus metrics registry (`metrics.ts`) for Grafana dashboards.
- **Multi-Driver Environment Switching**:
  - **Local Dev**: Zero-config in-memory/SQLite setup (`SQLite`, `InMemoryDoc`, `InMemoryCache`, `InMemoryQueue`).
  - **Production Cloud**: Single environment variable switch (`Postgres`, `MongoDB`, `Redis`, `RabbitMQ`).

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Typecheck & run unit tests
npm test

# 3. Generate a new domain module (e.g. Product)
npm run generate:module Product

# 4. Start local development server
npm run dev
```

---

## 🏛️ Ecosystem Roadmap & Repositories

| Language Repository | Priority | Status | GitHub Repository |
|---|:---:|:---:|---|
| **TypeScript** | 🥇 Priority 1 | **Production Ready** | [`shregar1/lattice-ts`](https://github.com/shregar1/lattice-ts) |
| **Python** | 🥈 Priority 2 | **Full Feature Parity** | [`shregar1/lattice-py`](https://github.com/shregar1/lattice-py) |
| **Rust** | 🥉 Priority 3 | **Full Feature Parity** | [`shregar1/lattice-rs`](https://github.com/shregar1/lattice-rs) |
| **Go** | 4️⃣ Priority 4 | **Full Feature Parity** | [`shregar1/lattice-go`](https://github.com/shregar1/lattice-go) |
| **Ruby** | 5️⃣ Priority 5 | **Full Feature Parity** | [`shregar1/lattice-rb`](https://github.com/shregar1/lattice-rb) |

---

## 🤝 Urging Developer Contributions

We urge open-source developers and engineers to contribute to Lattice! Please review the 17 architectural specifications in `docs/plans/`, pick an open implementation blueprint, submit Pull Requests (PRs), and help expand the Lattice multi-language ecosystem. All PRs will be reviewed and merged promptly.
