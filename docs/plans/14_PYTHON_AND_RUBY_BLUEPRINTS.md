# 14 — Python & Ruby Implementation Blueprints (`lattice-py` & `lattice-rb`)

> **Lattice Cross-Language Specification** — Package layouts for Python and Ruby.

---

## 1. Python Architecture (`lattice-py`)
- Framework: `FastAPI` + `Pydantic v2` + `SQLAlchemy 2.0 (AsyncIO)`
- Middleware: 15 Starlette middleware classes
- Routers: Nested `APIRouter` hierarchy (`api/v1/routes.py`)

## 2. Ruby Architecture (`lattice-rb`)
- Framework: `Hanami` / `Roda` + `dry-validation` + `Sequel`
- Middleware: 15 Rack middleware classes
- Routers: Nested `Roda` route hierarchy
