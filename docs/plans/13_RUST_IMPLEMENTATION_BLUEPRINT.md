# 13 — Rust Implementation Blueprint (`lattice-rs`)

> **Lattice Cross-Language Specification** — Crate layout & trait translation for Rust.

---

## Crate & Module Mapping

```
src/
├── middleware/       ← 15 Tower Layer / Service implementations
├── controllers/      ← Axum handler functions & Router trees
├── orchestrators/    ← Structs implementing async workflow traits
├── services/         ← Business logic traits & async structs
├── repositories/     ← SQLx structs implementing async repository traits
└── dto/              ← Serde serializable DTO structs
```
