# 03 — Request Context & HTTP Abstractions

> **Lattice Core Blueprint** — Request metadata, correlation tracking, and uniform HTTP primitives.

---

## 1. The `RequestContext` Model

The `RequestContext` is instantiated at Stage 7 (`RequestContextMiddleware`) and attached to every request thread/context. It propagates metadata throughout all downstream layers.

### Context Fields

```typescript
export interface IRequestContext {
  requestUrn: string;        // Unique URN for this specific request execution (e.g. urn:req:1700000000:abc)
  referenceUrn: string;      // External reference/transaction URN
  correlationId: string;    // Distributed tracing correlation ID across services
  startTime: number;        // Epoch timestamp (ms) when request entered pipeline
  clientIp: string;         // Real client IP
  userAgent: string;        // User-Agent header
  path: string;             // Request path (/api/v1/auth/login)
  method: string;           // HTTP Method (GET, POST, etc.)
  userId?: string;          // Populated by Stage 10 (Authentication)
  tenantId?: string;        // Populated by Stage 11 (TenantResolution)
  roles?: string[];         // Populated by Stage 10 (Authentication)
  permissions?: string[];   // Populated by Stage 10 (Authentication)
  metrics?: IExecutionMetrics[]; // Performance stage execution metrics
}
```

---

## 2. HTTP Request & Response Envelopes

Every framework adapter translates native web server requests into standard `IHttpRequest` and `IHttpResponse` wrappers.

```typescript
export interface IHttpRequest<TBody = any, TParams = any, TQuery = any, THeaders = any> {
  body: TBody;
  params: TParams;
  query: TQuery;
  headers: THeaders;
  context?: IRequestContext;
}
```
