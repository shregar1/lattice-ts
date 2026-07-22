# 08 — Lookup Caching Framework

> **Lattice Core Blueprint** — Cache-first repository lookups and automatic cache invalidation.

---

## 1. Repository-Level Lookup Caching

Lookup tables (e.g. `Role`, `Status`, `Category`, `Country`) are read-heavy and static. Lattice repository layers implement automatic cache-first resolution via `GenericLookupRepository`:

```
Read Request ➔ Cache lookup (e.g. lookup:roles:code:ADMIN)
                      │
           ┌──────────┴──────────┐
        [HIT]                 [MISS]
           │                     │
    Return Cached DTO      Query Database ➔ Populate Cache (TTL 3600s) ➔ Return
```

---

## 2. Invalidation Protocol

Any write operation (create, update, delete) on a lookup entity automatically invokes `invalidateCache()`, flushing the cached keys for that entity type across memory or Redis.
