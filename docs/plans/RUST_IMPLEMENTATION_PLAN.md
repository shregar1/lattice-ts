# Lattice (Rust Edition) — Implementation Plan & Architecture Blueprint

> **`lattice-rs`** is the Rust implementation of the Lattice Enterprise Backend Specification.

---

## 🛠️ Technology Stack & Crate Architecture

| Concern | Rust Ecosystem |
|---|---|
| **Language** | Rust 2021 Edition |
| **HTTP Web Framework** | `axum` (or `actix-web`) |
| **Async Runtime** | `tokio` |
| **Dependency Injection** | Trait composition / `shred` / Axum `Extension` / `State` |
| **Validation** | `validator` crate / `serde` |
| **Database / ORM** | `sqlx` (async, compile-time checked) |
| **Cache** | `moka` (high-performance in-memory) / `redis` |
| **Logging & Tracing** | `tracing`, `tracing-subscriber` (JSON formatter) |
| **Serialization** | `serde`, `serde_json` |

---

## 📁 Repository Directory Structure

```
lattice-rs/
├── Cargo.toml
├── src/
│   ├── main.rs                     ← Entry point & server listener
│   ├── lib.rs                      ← Module export root
│   ├── config/                     ← Environment configuration structs
│   ├── middleware/                 ← 15-stage Tower middleware layer
│   │   ├── pipeline.rs
│   │   ├── exception_handler.rs
│   │   ├── trusted_host.rs
│   │   ├── security_headers.rs
│   │   ├── cors.rs
│   │   ├── compression.rs
│   │   ├── request_timeout.rs
│   │   ├── request_context.rs
│   │   ├── request_logger.rs
│   │   ├── rate_limit.rs
│   │   ├── authentication.rs
│   │   ├── tenant_resolution.rs
│   │   ├── authorization.rs
│   │   ├── request_validation.rs
│   │   ├── response_builder.rs
│   │   └── audit_logger.rs
│   ├── controllers/                ← Thin Axum handlers
│   │   ├── routes.rs               ← Root Axum router (/api)
│   │   └── api/
│   │       ├── routes.rs           ← API router (/v1)
│   │       └── v1/
│   │           ├── routes.rs       ← V1 router
│   │           ├── auth/
│   │           │   ├── routes.rs
│   │           │   ├── register.rs
│   │           │   └── login.rs
│   │           └── platform/
│   │               ├── routes.rs
│   │               └── health.rs
│   ├── orchestrators/             ← Workflow coordination & Unit of Work
│   │   ├── auth_orchestrator.rs
│   │   └── traits.rs
│   ├── services/                  ← Single-capability domain logic
│   │   ├── user_service.rs
│   │   ├── auth_service.rs
│   │   └── traits.rs
│   ├── repositories/              ← Persistence traits & SQLx implementations
│   │   ├── base_repository.rs
│   │   ├── user_repository.rs
│   │   └── lookups/
│   │       └── role_repository.rs
│   ├── models/                    ← Pure database structs (sqlx::FromRow)
│   │   ├── user.rs
│   │   └── lookup.rs
│   ├── dto/                       ← Request, response, and envelope structs
│   │   ├── requests/
│   │   ├── responses/
│   │   └── envelope.rs
│   └── utilities/                 ← UoW, tracing, cache traits
│       ├── unit_of_work.rs
│       ├── cache.rs
│       └── metrics.rs
├── tests/
└── Dockerfile
```

---

## 🏛️ Layer Traits & Async Abstractions

### 1. Repository Trait & Implementation

```rust
use async_trait::async_trait;
use sqlx::PgPool;

#[async_trait]
pub trait UserRepositoryTrait: Send + Sync {
    async fn find_by_id(&self, id: &str) -> Result<Option<UserModel>, AppError>;
    async fn find_by_email(&self, email: &str) -> Result<Option<UserModel>, AppError>;
    async fn create(&self, user: &CreateUserModel) -> Result<UserModel, AppError>;
}

pub struct UserRepository {
    pool: PgPool,
}

#[async_trait]
impl UserRepositoryTrait for UserRepository {
    async fn find_by_email(&self, email: &str) -> Result<Option<UserModel>, AppError> {
        let record = sqlx::query_as!(UserModel, "SELECT * FROM users WHERE email = $1 AND is_deleted = false", email)
            .fetch_optional(&self.pool)
            .await?;
        Ok(record)
    }
}
```

### 2. Orchestrator Trait & Unit of Work Execution

```rust
pub struct AuthOrchestrator<U, S, A> {
    uow: Arc<dyn UnitOfWorkTrait>,
    user_service: Arc<U>,
    auth_service: Arc<A>,
}

impl<U, S, A> AuthOrchestrator<U, S, A>
where
    U: UserServiceTrait,
    A: AuthServiceTrait,
{
    pub async fn register(&self, req: RegisterRequestDto) -> Result<AuthResponseDto, AppError> {
        self.uow.execute_in_transaction(|tx| async move {
            let user = self.user_service.create_user(tx, req).await?;
            let token = self.auth_service.generate_token(&user.id).await?;
            Ok(AuthResponseDto { user, token })
        }).await
    }
}
```

---

## 🚀 Execution Roadmap

1. `cargo new lattice-rs --bin`
2. Configure `Cargo.toml` with `axum`, `tokio`, `sqlx`, `tracing`, `serde`
3. Implement `UnitOfWork` & `BaseResponseEnvelope`
4. Build 15 Tower middleware layers in `src/middleware/`
5. Assemble Axum nested route hierarchy in `src/controllers/`
