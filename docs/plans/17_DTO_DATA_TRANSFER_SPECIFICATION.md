# Architectural Specification 17: DTO Inter-Layer Data Transfer Standard

## Principle & Rule Statement

In the **Lattice Architecture**, raw untyped JSON objects (`{ [key: string]: any }`) must **NEVER** be passed directly between architectural layers. All data transfer across boundaries—especially between **Controllers**, **Services**, **Orchestrators**, and **Repositories**—must be encapsulated inside strongly-typed **Data Transfer Objects (DTOs)**.

---

## Why DTOs Are Mandatory

1. **Strict Type Safety & Contract Guarantee**: Passing DTO instances guarantees compile-time type safety across layer boundaries.
2. **Upstream Payload Sanitization**: Prevents mass-assignment vulnerabilities (e.g. injecting `isAdmin: true` into a raw JSON request body).
3. **Stage 13 Middleware Validation Integration**: Request DTOs are validated upstream at Stage 13 (`RequestValidationMiddleware`) before ever reaching a Controller `handle()` method.
4. **API Envelope Uniformity**: Response DTOs (`BaseResponseEnvelopeDTO<T>`) enforce standard envelope keys (`transactionUrn`, `status`, `responseMessage`, `responseKey`, `data`, `metadata`).

---

## DTO Lifecycle & Layer Boundaries

```
[ HTTP Request Body ]
         │
         ▼ (Stage 13: RequestValidationMiddleware validates against Zod/DTO schema)
[ RegisterUserRequestDTO ]
         │
         ▼
[ AuthController.register() ]
         │
         ▼ (Passes DTO to Orchestrator)
[ AuthOrchestrator.registerUser(dto: RegisterUserRequestDTO) ]
         │
         ▼ (Passes DTO to Service)
[ UserService.create(dto: RegisterUserRequestDTO) ]
         │
         ▼ (Maps DTO to Model)
[ UserModel ]
         │
         ▼ (Returns Response DTO to Client)
[ BaseResponseEnvelopeDTO<UserResponseDTO> ]
```

---

## Standard DTO Directory Organization

```
src/dto/
├── abstraction.ts                       ← Base DTO class with toJSON() and sanitize()
├── controller/
│   ├── requests/
│   │   ├── register_user_request.ts     ← Input payload DTO for registration
│   │   └── login_user_request.ts        ← Input payload DTO for login
│   └── responses/
│       ├── base_envelope.ts             ← Standard response envelope DTO
│       └── user_response.ts             ← Output response DTO for user
└── service/
    ├── user_create.ts                   ← Inter-service creation DTO
    └── user_update.ts                   ← Inter-service update DTO
```

---

## Recommended Practice Across All Languages

- **TypeScript (`lattice-ts`)**: Classes inheriting from `BaseDTO` with explicit TypeScript properties and Zod validation schemas.
- **Python (`lattice-py`)**: Pydantic models or Dataclasses inheriting from `BaseDTO`.
- **Go (`lattice-go`)**: Strongly-typed structs implementing `IBaseDTO` interface.
- **Rust (`lattice-rs`)**: Strongly-typed structs deriving `Serialize` and `Deserialize` implementing `BaseDTOTrait`.
- **Ruby (`lattice-rb`)**: Plain Ruby objects (POROs) extending `BaseDTO` with `ActiveModel::Validations`.
