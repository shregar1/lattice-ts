# Lattice (TypeScript Edition)

> **Lattice** is an open-source, enterprise-grade backend foundation built on Clean Architecture, SOLID principles, and strict layer isolation. 
>
> It is designed to serve as the unified architectural template across modern tech stacks (**`lattice-ts`**, **`lattice-go`**, **`lattice-rs`**, **`lattice-py`**, **`lattice-rb`**).

---

## 🏛️ Architecture & Strict Layer Flow

Every request in a Lattice application flows predictably through 15 stages of middleware and discrete architectural boundaries:

```
HTTP Request
      │
      ▼
Middleware Pipeline (15 Stages)
      │
      ▼
Controllers          ← Thin entry point (maps route, returns envelope)
      │
      ▼
Orchestrators        ← Workflow coordination & Unit of Work (Transaction boundary)
      │
      ▼
Services            ← Focused single-capability business logic
      │
      ▼
Repositories        ← Persistence abstraction & lookup caching
      │
      ▼
Database Models     ← Pure entity & schema definitions
```

### Strict Architectural Boundaries

- **Controllers**: Thin request handlers. Validate schemas upstream in middleware, delegate to Orchestrators, return standard envelopes. *No business logic, no repository access.*
- **Orchestrators**: Coordinate multi-service workflows and manage Unit of Work transactions. *No raw SQL or HTTP concerns.*
- **Services**: Encapsulate single domain capabilities and call repositories through interfaces. *No direct model access or transaction management.*
- **Repositories**: Pure persistence abstraction. Support soft deletes, specifications, and automatic lookup caching. *No business rules, no commit/rollback.*
- **Models**: Pure schemas. *No logic references.*

---

## 🌐 The Lattice Ecosystem

| Repository | Stack | Status |
|---|---|---|
| **`shregar1/lattice-ts`** | TypeScript / Node.js | Active (Reference Implementation) |
| **`shregar1/lattice-go`** | Go | Coming Soon |
| **`shregar1/lattice-rs`** | Rust | Coming Soon |
| **`shregar1/lattice-py`** | Python | Coming Soon |
| **`shregar1/lattice-rb`** | Ruby | Coming Soon |

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/shregar1/lattice-ts.git
cd lattice-ts

# Install dependencies
npm install

# Run type check & unit tests
npm test

# Start local dev server
npm run dev
```

---

## 📘 Documentation & Assignment Playbook

Detailed guides and implementation protocols live in the `docs/` folder:

- **[Assignment Implementation Playbook](docs/ASSIGNMENT_PLAYBOOK.md)**: 12-phase step-by-step guide for plugging new business domains into Lattice without altering the scaffold.

---

## 📄 License

MIT © [shregar1](https://github.com/shregar1)
