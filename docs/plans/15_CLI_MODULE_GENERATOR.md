# 15 — CLI Module Generator Specification

> **Lattice Core Blueprint** — 2-Second automated clean-architecture domain scaffolding.

---

## 1. Overview & Purpose

The Lattice CLI Module Generator is designed to scaffold an entire clean-architecture domain module in under 2 seconds. When faced with a timed backend assignment or adding new features, running the generator auto-creates all 10 required architectural layer files:

```
src/
├── models/{entity}.ts                      ← 1. Model interface
├── dto/
│   ├── controller/
│   │   ├── requests/{entity}.ts            ← 2. Zod Request schema & DTO
│   │   └── responses/{entity}.ts           ← 3. Response DTO
├── repositories/{entity}.ts                ← 4. Repository interface & implementation
├── services/
│   ├── interfaces/{entity}.ts              ← 5. Service interface
│   ├── {entity}.ts                         ← 6. Service implementation
│   └── orchestrators/{entity}.ts           ← 7. Orchestrator implementation with UoW
└── controllers/api/v1/{entity_kebab}/
    ├── create.ts                           ← 8. Create Controller
    ├── fetch.ts                            ← 9. Fetch Controller
    └── routes.ts                           ← 10. Feature Router
```

---

## 2. Universal CLI Commands

- **TypeScript**: `npm run generate:module <EntityName>`
- **Go**: `go run scripts/create_module.go <EntityName>`
- **Rust**: `cargo run --example create_module <EntityName>`
- **Python**: `python scripts/create_module.py <EntityName>`
- **Ruby**: `ruby scripts/create_module.rb <EntityName>`
