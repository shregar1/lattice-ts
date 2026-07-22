# 11 — Dependency Injection & Application Bootstrap

> **Lattice Core Blueprint** — Container tokens, singleton / factory lifetimes, and startup sequence.

---

## 1. Dependency Container Principles

- **Constructor Injection Only**: All services, orchestrators, controllers, and repositories declare required dependencies in constructors.
- **`DI_TOKENS` Symbols**: Explicit symbol tokens map interfaces to factory registrations (`Symbol.for('IUserRepository')`).

---

## 2. Bootstrap Sequence (`ApplicationBootstrap`)

1. Initialize DI Container (`setupDependencies()`)
2. Resolve ConfigurationProvider & load settings
3. Initialize Logger, Cache Client, Storage Client
4. Assemble 15-stage Middleware Pipeline
5. Wire SIGINT / SIGTERM graceful shutdown listeners
