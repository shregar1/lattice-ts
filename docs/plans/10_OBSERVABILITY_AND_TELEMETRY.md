# 10 — Observability & Telemetry Framework

> **Lattice Core Blueprint** — Structured logging, distributed tracing, metrics registry, and health checks.

---

## 1. Telemetry Components

1. **`StructuredLogger`**: JSON log output formatted with `timestamp`, `level`, `serviceName`, `environment`, `hostname`, `requestId`, `correlationId`, `tenantId`, `userId`. Automatically redacts sensitive keys (`password`, `token`, `secret`, `apiKey`).
2. **`TracingUtility`**: Manages parent-child trace spans (`startSpan`, `endSpan`, `dbSpan`, `cacheSpan`, `httpSpan`).
3. **`MetricsRegistry`**: In-memory / Prometheus counters (`requestCount`, `authFailureCount`, `rateLimitEvents`), gauges (`memoryUsage`, `queueDepth`), and histograms (`requestLatency`, `dbLatency`).
4. **`HealthCheckRegistry`**: Endpoints for `/health` (deep evaluation), `/readiness`, and `/liveness`.
