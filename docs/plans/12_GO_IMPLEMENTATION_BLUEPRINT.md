# 12 — Go Implementation Blueprint (`lattice-go`)

> **Lattice Cross-Language Specification** — Package layout & idiom translation for Go.

---

## Package Mapping

```
internal/
├── middleware/       ← 15 middleware functions using Chi / Gin handlers
├── controllers/      ← Thin Chi HTTP handlers; hierarchical routes.go
├── orchestrators/    ← Go structs managing tx via sqlx.Tx
├── services/         ← Business logic structs implementing interfaces
├── repositories/     ← SQLx structs implementing interface bounds
└── dto/              ← Go structs with validator tags
```
