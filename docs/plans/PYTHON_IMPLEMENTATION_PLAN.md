# Lattice (Python Edition) — Implementation Plan & Architecture Blueprint

> **`lattice-py`** is the Python implementation of the Lattice Enterprise Backend Specification.

---

## 🛠️ Technology Stack & Package Architecture

| Concern | Python Ecosystem |
|---|---|
| **Language** | Python 3.12+ |
| **HTTP Web Framework** | `FastAPI` (or `Litestar` / `Sanic`) |
| **ASGI Server** | `uvicorn` |
| **Validation** | `Pydantic v2` |
| **Database / ORM** | `SQLAlchemy 2.0` (AsyncIO) / `tortoise-orm` |
| **Cache** | `redis-py` (async) / in-memory |
| **Logging** | `structlog` (JSON formatter) |
| **Dependency Injection** | `FastAPI Depends` / `dependency-injector` |

---

## 📁 Repository Directory Structure

```
lattice-py/
├── pyproject.toml
├── src/
│   └── lattice/
│       ├── main.py                 ← FastAPI initialization & lifespan
│       ├── config/                 ← BaseSettings configuration
│       ├── middleware/             ← 15-stage Starlette middleware stack
│       │   ├── pipeline.py
│       │   ├── exception_handler.py
│       │   ├── trusted_host.py
│       │   ├── security_headers.py
│       │   ├── cors.py
│       │   ├── compression.py
│       │   ├── request_timeout.py
│       │   ├── request_context.py
│       │   ├── request_logger.py
│       │   ├── rate_limit.py
│       │   ├── authentication.py
│       │   ├── tenant_resolution.py
│       │   ├── authorization.py
│       │   ├── request_validation.py
│       │   ├── response_builder.py
│       │   └── audit_logger.py
│       ├── controllers/            ← Thin APIRouter controllers
│       │   ├── routes.py           ← Root router (/api)
│       │   └── api/
│       │       ├── routes.py       ← API router (/v1)
│       │       └── v1/
│       │           ├── routes.py   ← V1 router
│       │           ├── auth/
│       │           │   ├── routes.py
│       │           │   ├── register.py
│       │           │   └── login.py
│       │           └── platform/
│       │               ├── routes.py
│       │               └── health.py
│       ├── orchestrators/         ← Multi-service workflow & UoW boundaries
│       │   ├── auth_orchestrator.py
│       │   └── base.py
│       ├── services/              ← Single-capability domain logic
│       │   ├── user_service.py
│       │   ├── auth_service.py
│       │   └── base.py
│       ├── repositories/          ← Persistence abstraction & lookup caching
│       │   ├── base_repository.py
│       │   ├── user_repository.py
│       │   └── lookups/
│       │       └── role_repository.py
│       ├── models/                ← Pure SQLAlchemy ORM Models
│       │   ├── user.py
│       │   └── lookup.py
│       ├── dto/                   ← Pydantic schemas (Request/Response)
│       │   ├── requests/
│       │   ├── responses/
│       │   └── envelope.py
│       └── utilities/             ← UnitOfWork, Logger, Cache
│           ├── unit_of_work.py
│           ├── cache.py
│           └── tracing.py
├── tests/
└── Dockerfile
```

---

## 🏛️ Layer Classes & Async Abstractions

### 1. Repository Abstract Base Class & Implementation

```python
from typing import Generic, TypeVar, Optional
from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")

class IUserRepository(ABC):
    @abstractmethod
    async def find_by_email(self, email: str) -> Optional[UserModel]:
        pass

class UserRepository(BaseRepository[UserModel], IUserRepository):
    def __init__(self, session: AsyncSession):
        super().__init__(session, UserModel)

    async def find_by_email(self, email: str) -> Optional[UserModel]:
        stmt = select(UserModel).where(UserModel.email == email, UserModel.is_deleted == False)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
```

### 2. Orchestrator & Unit of Work Context Manager

```python
class AuthOrchestrator(BaseOrchestrator):
    def __init__(
        self,
        unit_of_work: IUnitOfWork,
        user_service: IUserService,
        auth_service: IAuthService,
    ):
        super().__init__(unit_of_work)
        self.user_service = user_service
        self.auth_service = auth_service

    async def register(self, dto: RegisterRequestDTO) -> AuthResponseDTO:
        async with self.unit_of_work.transaction():
            user = await self.user_service.create_user(dto)
            token = await self.auth_service.generate_token(user.id)
            return AuthResponseDTO(user=user, token=token)
```

---

## 🚀 Execution Roadmap

1. `poetry init` / `uv init`
2. Install `fastapi`, `uvicorn`, `pydantic`, `sqlalchemy`, `asyncpg`, `structlog`
3. Build 15-stage middleware pipeline in `src/lattice/middleware/`
4. Assemble nested APIRouter hierarchy in `src/lattice/controllers/`
