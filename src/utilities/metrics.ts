import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';

export interface IMetricCounter {
  increment(value?: number, labels?: Record<string, string>): void;
  value(labels?: Record<string, string>): number;
}

export interface IMetricGauge {
  set(value: number, labels?: Record<string, string>): void;
  value(labels?: Record<string, string>): number;
}

export interface IMetricHistogram {
  observe(durationMs: number, labels?: Record<string, string>): void;
  percentile(p: number, labels?: Record<string, string>): number;
  average(labels?: Record<string, string>): number;
}

class InMemoryCounter implements IMetricCounter {
  private counts = new Map<string, number>();

  public increment(value: number = 1, labels: Record<string, string> = {}): void {
    const key = JSON.stringify(labels);
    this.counts.set(key, (this.counts.get(key) ?? 0) + value);
  }

  public value(labels: Record<string, string> = {}): number {
    return this.counts.get(JSON.stringify(labels)) ?? 0;
  }
}

class InMemoryGauge implements IMetricGauge {
  private values = new Map<string, number>();

  public set(value: number, labels: Record<string, string> = {}): void {
    this.values.set(JSON.stringify(labels), value);
  }

  public value(labels: Record<string, string> = {}): number {
    return this.values.get(JSON.stringify(labels)) ?? 0;
  }
}

class InMemoryHistogram implements IMetricHistogram {
  private observations = new Map<string, number[]>();

  public observe(durationMs: number, labels: Record<string, string> = {}): void {
    const key = JSON.stringify(labels);
    const existing = this.observations.get(key) ?? [];
    existing.push(durationMs);
    this.observations.set(key, existing);
  }

  public percentile(p: number, labels: Record<string, string> = {}): number {
    const data = [...(this.observations.get(JSON.stringify(labels)) ?? [])].sort((a, b) => a - b);
    if (data.length === 0) return 0;
    const idx = Math.ceil((p / 100) * data.length) - 1;
    return data[idx];
  }

  public average(labels: Record<string, string> = {}): number {
    const data = this.observations.get(JSON.stringify(labels)) ?? [];
    if (data.length === 0) return 0;
    return data.reduce((sum, v) => sum + v, 0) / data.length;
  }
}

class MetricsRegistryClass extends ModuleBaseUtility {
  public readonly logger: ILogger;

  // Request-level counters
  public readonly requestCount: IMetricCounter = new InMemoryCounter();
  public readonly successCount: IMetricCounter = new InMemoryCounter();
  public readonly failureCount: IMetricCounter = new InMemoryCounter();
  public readonly authFailureCount: IMetricCounter = new InMemoryCounter();
  public readonly rateLimitEventCount: IMetricCounter = new InMemoryCounter();
  public readonly cacheHitCount: IMetricCounter = new InMemoryCounter();
  public readonly cacheMissCount: IMetricCounter = new InMemoryCounter();

  // Gauges
  public readonly memoryUsage: IMetricGauge = new InMemoryGauge();
  public readonly cpuUsage: IMetricGauge = new InMemoryGauge();
  public readonly queueDepth: IMetricGauge = new InMemoryGauge();

  // Histograms (latencies)
  public readonly requestLatency: IMetricHistogram = new InMemoryHistogram();
  public readonly dbLatency: IMetricHistogram = new InMemoryHistogram();
  public readonly cacheLatency: IMetricHistogram = new InMemoryHistogram();
  public readonly externalApiLatency: IMetricHistogram = new InMemoryHistogram();

  constructor() {
    super();
    this.logger = new StructuredLogger('MetricsRegistry');
  }

  /** Capture current process memory and CPU metrics */
  public captureSystemMetrics(): void {
    const mem = process.memoryUsage();
    this.memoryUsage.set(mem.heapUsed);
    // CPU usage requires a polling approach — we set a placeholder
    this.cpuUsage.set(0);
  }

  /** Serialize all metrics to a plain object for health reports or export */
  public snapshot(): Record<string, any> {
    this.captureSystemMetrics();
    return {
      requests: {
        total: this.requestCount.value(),
        success: this.successCount.value(),
        failure: this.failureCount.value(),
        authFailures: this.authFailureCount.value(),
        rateLimitEvents: this.rateLimitEventCount.value(),
      },
      cache: {
        hits: this.cacheHitCount.value(),
        misses: this.cacheMissCount.value(),
        hitRatio: (() => {
          const hits = this.cacheHitCount.value();
          const total = hits + this.cacheMissCount.value();
          return total === 0 ? 0 : Number((hits / total).toFixed(4));
        })(),
      },
      latency: {
        request: {
          avg: this.requestLatency.average(),
          p95: this.requestLatency.percentile(95),
          p99: this.requestLatency.percentile(99),
        },
        db: {
          avg: this.dbLatency.average(),
          p95: this.dbLatency.percentile(95),
        },
        cache: {
          avg: this.cacheLatency.average(),
        },
      },
      system: {
        memoryHeapUsedBytes: this.memoryUsage.value(),
        queueDepth: this.queueDepth.value(),
      },
    };
  }
}

/** Singleton registry — injected or imported directly by infrastructure (never by business logic) */
export const MetricsRegistry = new MetricsRegistryClass();
