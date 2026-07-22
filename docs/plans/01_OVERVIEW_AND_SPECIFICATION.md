# 01 — Universal Architectural Overview & Specification

> **Lattice Core Blueprint** — Standardized cross-language specification for enterprise-grade backend systems.

---

## 1. System Vision & Purpose

Lattice is a language-agnostic architecture framework designed to eliminate structural debt, enforce clean separation of concerns, and establish predictable request life cycles across engineering teams.

Every Lattice application across **TypeScript, Go, Rust, Python, and Ruby** follows the exact same 15-stage middleware pipeline, 5-layer separation of concerns, Unit of Work transaction boundaries, and standard response contracts.

---

## 2. Global Execution Flow

```
HTTP Request
      │
      ▼
Middleware Pipeline (15 Stages)
      │
      ▼
Controller Layer     ← Thin entry point (maps route, returns envelope)
      │
      ▼
Orchestrator Layer   ← Multi-service workflow & Unit of Work (Transaction boundary)
      │
      ▼
Service Layer        ← Focused single-capability business logic
      │
      ▼
Repository Layer     ← Persistence abstraction & lookup caching
      │
      ▼
Database Models      ← Pure entity & schema definitions
```

---

## 3. Core Architectural Principles

1. **SOLID Principles**: Every class/struct has a single responsibility.
2. **Interface-First Design**: Higher layers depend on interfaces/traits, never on concrete implementations.
3. **Thin Controllers**: Controllers contain zero business logic and zero persistence logic. Validation occurs upstream in middleware.
4. **Orchestrator-Managed Transactions**: Orchestrators exclusively open Unit of Work transactions. Services and Repositories never call `commit()` or `rollback()`.
5. **No Direct Model Access in Services**: Services communicate with repositories via interfaces.
6. **Standardized Response Envelopes**: Every API endpoint returns the same JSON structure regardless of outcome.
