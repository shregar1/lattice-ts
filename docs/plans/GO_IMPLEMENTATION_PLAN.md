# Lattice (Go Edition) — Implementation Plan & Architecture Blueprint

> **`lattice-go`** is the Go implementation of the Lattice Enterprise Backend Specification.

---

## 🛠️ Technology Stack & Package Architecture

| Concern | Go Tooling |
|---|---|
| **Language** | Go 1.22+ |
| **HTTP Framework** | `chi` (or `gin` / `net/http`) |
| **Dependency Injection** | `uber-go/dig` or `wire` |
| **Validation** | `go-playground/validator/v10` |
| **Database / ORM** | `sqlx` or `gorm` / `pgx` |
| **Cache** | `go-redis/redis/v9` / in-memory |
| **Logging** | `uber-go/zap` (Structured JSON) |
| **Testing** | Standard `testing`, `testify`, `mockery` |

---

## 📁 Repository Directory Structure

```
lattice-go/
├── cmd/
│   └── server/
│       └── main.go                 ← Application entry point & bootstrap
├── internal/
│   ├── config/                     ← Config provider DTOs & loader (env)
│   ├── middleware/                 ← 15-stage middleware pipeline
│   │   ├── pipeline.go
│   │   ├── exception_handler.go
│   │   ├── trusted_host.go
│   │   ├── security_headers.go
│   │   ├── cors.go
│   │   ├── compression.go
│   │   ├── request_timeout.go
│   │   ├── request_context.go
│   │   ├── request_logger.go
│   │   ├── rate_limit.go
│   │   ├── authentication.go
│   │   ├── tenant_resolution.go
│   │   ├── authorization.go
│   │   ├── request_validation.go
│   │   ├── response_builder.go
│   │   └── audit_logger.go
│   ├── controllers/                ← Thin HTTP handlers
│   │   ├── routes.go               ← Root router (/api)
│   │   └── api/
│   │       ├── routes.go           ← API router (/v1)
│   │       └── v1/
│   │           ├── routes.go       ← V1 router
│   │           ├── auth/
│   │           │   ├── routes.go
│   │           │   ├── register.go
│   │           │   └── login.go
│   │           └── platform/
│   │               ├── routes.go
│   │               └── health.go
│   ├── orchestrators/             ← Multi-service workflows & UoW boundaries
│   │   ├── auth_orchestrator.go
│   │   └── interfaces.go
│   ├── services/                  ← Single-capability domain logic
│   │   ├── user_service.go
│   │   ├── auth_service.go
│   │   └── interfaces.go
│   ├── repositories/              ← Persistence abstraction & lookup caching
│   │   ├── base_repository.go
│   │   ├── user_repository.go
│   │   └── lookups/
│   │       └── role_repository.go
│   ├── models/                    ← Pure database structs & entities
│   │   ├── user.go
│   │   └── lookup.go
│   ├── dto/                       ← Request, response, & envelope structs
│   │   ├── requests/
│   │   ├── responses/
│   │   └── envelope.go
│   └── pkg/
│       ├── di/                    ← Container registration
│       ├── logger/                ← Zap structured logger wrapper
│       ├── unitofwork/            ← DB Tx Unit of Work interface
│       ├── cache/                 ← Redis / In-memory client interface
│       └── tracing/               ← OpenTelemetry span utility
├── docs/
├── go.mod
├── go.sum
└── Dockerfile
```

---

## 🏛️ Layer Interfaces in Go

### 1. Repository Interface & Implementation

```go
package repositories

type IUserRepository interface {
    IBaseRepository[models.User, string]
    FindByEmail(ctx context.Context, email string) (*models.User, error)
}

type UserRepository struct {
    *BaseRepository[models.User, string]
}

func NewUserRepository(db *sqlx.DB) IUserRepository {
    return &UserRepository{
        BaseRepository: NewBaseRepository[models.User, string](db, "users"),
    }
}
```

### 2. Service Layer

```go
package services

type IUserService interface {
    GetUserByID(ctx context.Context, id string) (*dto.UserResponseDTO, error)
    CreateUser(ctx context.Context, input dto.CreateUserInput) (*dto.UserResponseDTO, error)
}

type UserService struct {
    userRepo repositories.IUserRepository
    logger   logger.ILogger
}
```

### 3. Orchestrator Layer & Transaction Boundary

```go
package orchestrators

type AuthOrchestrator struct {
    uow         unitofwork.IUnitOfWork
    userService services.IUserService
    authService services.IAuthService
}

func (o *AuthOrchestrator) Register(ctx context.Context, input dto.RegisterInput) (*dto.AuthResponseDTO, error) {
    var result *dto.AuthResponseDTO

    err := o.uow.ExecuteInTransaction(ctx, func(txCtx context.Context) error {
        user, err := o.userService.CreateUser(txCtx, input.ToCreateUserInput())
        if err != nil {
            return err
        }
        token, err := o.authService.GenerateToken(txCtx, user.ID)
        if err != nil {
            return err
        }
        result = &dto.AuthResponseDTO{User: user, Token: token}
        return nil
    })

    return result, err
}
```

---

## 🚀 Execution Roadmap

1. `go mod init github.com/shregar1/lattice-go`
2. Implement `pkg/unitofwork` & `pkg/logger`
3. Build 15-stage middleware pipeline in `internal/middleware`
4. Assemble hierarchical router tree in `internal/controllers`
5. Port auth reference module & unit tests
