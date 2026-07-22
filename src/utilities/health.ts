import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';

export type HealthStatus = 'UP' | 'DOWN' | 'DEGRADED';

export interface IHealthIndicatorResult {
  name: string;
  status: HealthStatus;
  message?: string;
  details?: Record<string, any>;
  durationMs?: number;
}

export interface IHealthReport {
  status: HealthStatus;         // Aggregate status
  timestamp: string;
  environment: string;
  indicators: IHealthIndicatorResult[];
}

export interface IHealthIndicator {
  name: string;
  check(): Promise<IHealthIndicatorResult>;
}

// ---- Built-in Indicators ----

export class DatabaseHealthIndicator implements IHealthIndicator {
  public readonly name = 'database';

  constructor(private readonly pingFn: () => Promise<boolean>) {}

  public async check(): Promise<IHealthIndicatorResult> {
    const start = performance.now();
    try {
      const ok = await this.pingFn();
      return {
        name: this.name,
        status: ok ? 'UP' : 'DOWN',
        durationMs: Number((performance.now() - start).toFixed(2)),
      };
    } catch (err: any) {
      return {
        name: this.name,
        status: 'DOWN',
        message: err?.message,
        durationMs: Number((performance.now() - start).toFixed(2)),
      };
    }
  }
}

export class CacheHealthIndicator implements IHealthIndicator {
  public readonly name = 'cache';

  constructor(private readonly pingFn: () => Promise<boolean>) {}

  public async check(): Promise<IHealthIndicatorResult> {
    const start = performance.now();
    try {
      const ok = await this.pingFn();
      return { name: this.name, status: ok ? 'UP' : 'DEGRADED', durationMs: Number((performance.now() - start).toFixed(2)) };
    } catch (err: any) {
      return { name: this.name, status: 'DEGRADED', message: err?.message };
    }
  }
}

export class StorageHealthIndicator implements IHealthIndicator {
  public readonly name = 'storage';

  constructor(private readonly pingFn: () => Promise<boolean>) {}

  public async check(): Promise<IHealthIndicatorResult> {
    const start = performance.now();
    try {
      const ok = await this.pingFn();
      return { name: this.name, status: ok ? 'UP' : 'DEGRADED', durationMs: Number((performance.now() - start).toFixed(2)) };
    } catch (err: any) {
      return { name: this.name, status: 'DEGRADED', message: err?.message };
    }
  }
}

// ---- Health Registry ----

class HealthCheckRegistryClass extends ModuleBaseUtility {
  private readonly indicators: IHealthIndicator[] = [];
  public readonly logger: ILogger;

  constructor() {
    super();
    this.logger = new StructuredLogger('HealthCheckRegistry');
  }

  public register(indicator: IHealthIndicator): void {
    this.indicators.push(indicator);
    this.logger.debug(`Registered health indicator: ${indicator.name}`);
  }

  /** Liveness — is the process alive? (always UP unless fatally broken) */
  public async liveness(): Promise<IHealthReport> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      indicators: [{ name: 'self', status: 'UP' }],
    };
  }

  /** Readiness — are all dependencies healthy? */
  public async readiness(): Promise<IHealthReport> {
    return this.evaluate();
  }

  /** Deep — full dependency health check */
  public async evaluate(): Promise<IHealthReport> {
    const results = await Promise.all(this.indicators.map((i) => i.check()));

    const aggregate: HealthStatus = results.some((r) => r.status === 'DOWN')
      ? 'DOWN'
      : results.some((r) => r.status === 'DEGRADED')
      ? 'DEGRADED'
      : 'UP';

    return {
      status: aggregate,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      indicators: results,
    };
  }
}

export const HealthCheckRegistry = new HealthCheckRegistryClass();
