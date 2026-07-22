# Architectural Specification 16: Hierarchical Router Tree Architecture

## Overview

The **Lattice Framework** enforces a **Hierarchical Router Tree Architecture** to manage routing across microservices and complex monorepos. Rather than defining flat, monolithic route files with scattered endpoints, Lattice structures routes as a composable tree matching the filesystem and domain hierarchy.

---

## Router Tree Structure

In every Lattice project, `routes.ts` exists at every structural boundary of the controller layer:

```
src/controllers/
├── routes.ts                ← Root Application Router (mounts /api)
└── api/
    ├── routes.ts            ← API Domain Router (mounts /v1, /v2)
    └── v1/
        ├── routes.ts        ← API Version 1 Router (mounts feature routers)
        ├── auth/
        │   ├── routes.ts    ← Feature Router: Auth (/api/v1/auth)
        │   └── auth_controller.ts
        └── platform/
            ├── routes.ts    ← Feature Router: Platform (/api/v1/platform)
            └── platform_controller.ts
```

---

## Technical Mechanics & Nesting Logic

Every `Router` instance exposes a `.use(prefix, childRouter)` method that flattens path trees while preserving middleware boundaries and path prefixes.

### Example: Nested Router Composition

```typescript
// 1. Feature Level: src/controllers/api/v1/auth/routes.ts
export function createAuthRouter(controller: AuthController): Router {
  const router = new Router('/auth');
  router.post('/register', (req, res) => controller.register(req, res));
  router.post('/login', (req, res) => controller.login(req, res));
  return router;
}

// 2. Version Level: src/controllers/api/v1/routes.ts
export function createV1Router(authRouter: Router, platformRouter: Router): Router {
  const router = new Router('/v1');
  router.use(authRouter);      // Mounts under /v1/auth
  router.use(platformRouter);  // Mounts under /v1/platform
  return router;
}

// 3. API Level: src/controllers/api/routes.ts
export function createApiRouter(v1Router: Router): Router {
  const router = new Router('/api');
  router.use(v1Router);        // Mounts under /api/v1
  return router;
}

// 4. Root Application Level: src/controllers/routes.ts
export function createRootRouter(apiRouter: Router): Router {
  const router = new Router('');
  router.use(apiRouter);        // Final path: /api/v1/auth/login
  return router;
}
```

---

## Key Benefits of Hierarchical Routing

1. **Subtree Middleware Scoping**: Middleware applied at `/api/v1/auth` runs ONLY for authentication endpoints without cluttering global HTTP pipelines.
2. **Version Isolation**: Side-by-side support for `/api/v1` and `/api/v2` with zero route collisions.
3. **Automated CLI Module Generator Support**: Running `npm run generate:module User` automatically hooks `user_routes.ts` directly into `src/controllers/api/v1/routes.ts`.
