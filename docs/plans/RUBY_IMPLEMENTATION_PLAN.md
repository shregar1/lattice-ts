# Lattice (Ruby Edition) — Implementation Plan & Architecture Blueprint

> **`lattice-rb`** is the Ruby implementation of the Lattice Enterprise Backend Specification.

---

## 🛠️ Technology Stack & Gem Architecture

| Concern | Ruby Ecosystem |
|---|---|
| **Language** | Ruby 3.3+ |
| **HTTP Web Framework** | `Hanami` (or `Roda` / `Sinatra`) |
| **Validation** | `dry-validation` / `dry-struct` |
| **Database / ORM** | `Sequel` or `ROM-rb` (Ruby Object Mapper) |
| **Cache** | `redis-rb` / `dalli` |
| **Logging** | `semantic_logger` (Structured JSON) |
| **Dependency Injection** | `dry-auto_inject` / `dry-system` |

---

## 📁 Repository Directory Structure

```
lattice-rb/
├── Gemfile
├── Rakefile
├── config.ru
├── app/
│   ├── config/                     ← Config loader (dry-configurable)
│   ├── middleware/                 ← 15-stage Rack middleware stack
│   │   ├── pipeline.rb
│   │   ├── exception_handler.rb
│   │   ├── trusted_host.rb
│   │   ├── security_headers.rb
│   │   ├── cors.rb
│   │   ├── compression.rb
│   │   ├── request_timeout.rb
│   │   ├── request_context.rb
│   │   ├── request_logger.rb
│   │   ├── rate_limit.rb
│   │   ├── authentication.rb
│   │   ├── tenant_resolution.rb
│   │   ├── authorization.rb
│   │   ├── request_validation.rb
│   │   ├── response_builder.rb
│   │   └── audit_logger.rb
│   ├── controllers/                ← Thin Roda / Hanami actions
│   │   ├── routes.rb               ← Root router (/api)
│   │   └── api/
│   │       ├── routes.rb           ← API router (/v1)
│   │       └── v1/
│   │           ├── routes.rb       ← V1 router
│   │           ├── auth/
│   │           │   ├── routes.rb
│   │           │   ├── register.rb
│   │           │   └── login.rb
│   │           └── platform/
│   │               ├── routes.rb
│   │               └── health.rb
│   ├── orchestrators/             ← Workflow coordination & UoW boundaries
│   │   ├── auth_orchestrator.rb
│   │   └── base.rb
│   ├── services/                  ← Single-capability domain logic
│   │   ├── user_service.rb
│   │   ├── auth_service.rb
│   │   └── base.rb
│   ├── repositories/              ← Persistence abstraction & lookup caching
│   │   ├── base_repository.rb
│   │   ├── user_repository.rb
│   │   └── lookups/
│   │       └── role_repository.rb
│   ├── models/                    ← Pure Sequel models / ROM relations
│   │   ├── user.rb
│   │   └── lookup.rb
│   ├── dto/                       ← Dry::Struct DTO definitions
│   │   ├── requests/
│   │   ├── responses/
│   │   └── envelope.rb
│   └── utilities/                 ← UnitOfWork, Logger, Cache
│       ├── unit_of_work.rb
│       ├── cache.rb
│       └── metrics.rb
├── spec/                          ← RSpec test suite
└── Dockerfile
```

---

## 🏛️ Layer Classes & Functional Abstractions

### 1. Repository Class (Sequel / ROM-rb)

```ruby
module Repositories
  class UserRepository < BaseRepository
    def find_by_email(email)
      dataset.where(email: email, is_deleted: false).first
    end
  end
end
```

### 2. Orchestrator Class & Unit of Work Boundary

```ruby
module Orchestrators
  class AuthOrchestrator < BaseOrchestrator
    include Import['services.user_service', 'services.auth_service', 'utilities.unit_of_work']

    def register(dto)
      unit_of_work.execute_in_transaction do
        user = user_service.create_user(dto)
        token = auth_service.generate_token(user.id)
        Dto::AuthResponseDto.new(user: user, token: token)
      end
    end
  end
end
```

---

## 🚀 Execution Roadmap

1. `bundle init`
2. Add `roda`, `sequel`, `dry-system`, `dry-validation`, `dry-struct`, `semantic_logger`
3. Build 15 Rack middleware stages in `app/middleware/`
4. Assemble nested Roda route hierarchy in `app/controllers/`
