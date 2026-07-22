# 02 — The 15-Stage Middleware Pipeline

> **Lattice Core Blueprint** — Detailed specification of all 15 middleware stages.

---

## Stage-by-Stage Breakdown

```
[Req] ➔ S1 ➔ S2 ➔ S3 ➔ S4 ➔ S5 ➔ S6 ➔ S7 ➔ S8 ➔ S9 ➔ S10 ➔ S11 ➔ S12 ➔ S13 ➔ S14 ➔ S15 ➔ [Controller]
```

| Stage | Name | Input / Context | Output / Action |
|---|---|---|---|
| **1** | `ExceptionHandler` | Raw request | Captures all exceptions thrown downstream; formats into standard `BaseResponseEnvelope` |
| **2** | `TrustedHost` | `Host` header | Validates host against whitelist; throws `ForbiddenException` if invalid |
| **3** | `SecurityHeaders` | Response headers | Injects OWASP headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, etc.) |
| **4** | `Cors` | `Origin` header | Manages preflight OPTIONS & CORS header validation |
| **5** | `Compression` | `Accept-Encoding` | Compresses responses over threshold size via Gzip/Deflate |
| **6** | `RequestTimeout` | Configured timeout ms | Cancels request execution if runtime exceeds limit (e.g. 10,000ms) |
| **7** | `RequestContext` | Headers / Remote IP | Instantiates `RequestContext` (`requestUrn`, `correlationId`, `startTime`, IP, UA) |
| **8** | `RequestLogger` | `RequestContext` | Emits structured JSON log entry for request entry & completion |
| **9** | `RateLimit` | Client IP / TenantId | Enforces sliding-window rate limit; returns `429 Too Many Requests` on breach |
| **10** | `Authentication` | `Authorization: Bearer` | Decodes JWT; attaches `userId`, `roles`, `permissions` to `RequestContext` |
| **11** | `TenantResolution` | Header / Subdomain / JWT | Resolves `tenantId` & enforces multi-tenant boundary |
| **12** | `Authorization` | Route metadata | Validates user `roles`/`permissions` against route requirements; throws `403` if unauthorized |
| **13** | `RequestValidation` | Request payload & Zod/Schema | Validates payload *before* controller entry; throws `400` with field errors if invalid |
| **14** | `ResponseBuilder` | Controller response | Envelopes successful data payload into `BaseResponseEnvelope` |
| **15** | `AuditLogger` | Action metadata | Publishes immutable audit log entry for state-changing operations |
