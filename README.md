# Lattice (TypeScript Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/tests-37%20passed-brightgreen.svg)]()

> **Lattice** is an open-source, enterprise-grade backend template suite built on Clean Architecture, SOLID principles, and strict 5-layer isolation.

---

## ⚠️ Language Rollout & Priority Roadmap

Lattice is being developed across 5 major programming languages in the following priority order:

1. 🥇 **TypeScript** ([`shregar1/lattice-ts`](https://github.com/shregar1/lattice-ts)) — **Active Reference Implementation (Production Ready)**
2. 🥈 **Python** ([`shregar1/lattice-py`](https://github.com/shregar1/lattice-py)) — *In Active Development*
3. 🥉 **Rust** ([`shregar1/lattice-rs`](https://github.com/shregar1/lattice-rs)) — *In Pipeline*
4. 4️⃣ **Go** ([`shregar1/lattice-go`](https://github.com/shregar1/lattice-go)) — *In Pipeline*
5. 5️⃣ **Ruby** ([`shregar1/lattice-rb`](https://github.com/shregar1/lattice-rb)) — *In Pipeline*

---

## 🤝 Call for Open-Source Contributors

We strongly encourage open-source developers and software architects to contribute!

If you'd like to implement or enhance Lattice in any of the target languages:
1. Review the detailed architectural specifications in **[`docs/plans/`](docs/plans/)**.
2. Pick up an open implementation plan or language crate/gem/package.
3. Submit a Pull Request (**PR**)! All PRs following the architectural guidelines will be reviewed and merged.

---

## 🏛️ Architecture & 15-Stage Pipeline Flow

Every request flows through 15 pipeline stages before entering thin controllers:

```
HTTP Request
      │
      ▼
Middleware Pipeline (15 Stages)
      │
      ▼
Controllers          ← Thin HTTP handler (maps route, returns envelope)
      │
      ▼
Orchestrators        ← Multi-service workflow & Unit of Work (Transaction boundary)
      │
      ▼
Services            ← Single-capability business logic
      │
      ▼
Repositories        ← Persistence abstraction & lookup caching
      │
      ▼
Database Models     ← Pure entity & schema definitions
```

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

# Generate a clean-architecture module in 2 seconds
npm run generate:module Product

# Start dev server
npm run dev
```

---

## 📘 Documentation & Specification Suite

Detailed specifications live in **[`docs/plans/`](docs/plans/)**:
- **[`ASSIGNMENT_PLAYBOOK.md`](docs/ASSIGNMENT_PLAYBOOK.md)** — 12-phase step-by-step developer playbook
- **[`15_CLI_MODULE_GENERATOR.md`](docs/plans/15_CLI_MODULE_GENERATOR.md)** — 2-second domain module generator guide

---

## 📄 License

MIT © [shregar1](https://github.com/shregar1)
