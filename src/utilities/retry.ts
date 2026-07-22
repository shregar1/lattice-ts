import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';
import { MetricsRegistry } from './metrics';
import { TracingUtility } from './tracing';

export interface IRetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
  retryableErrors?: (err: any) => boolean;
}

export class RetryUtility extends ModuleBaseUtility {
  public static async executeWithRetry<T>(
    operation: () => Promise<T>,
    policy: IRetryPolicy = { maxRetries: 3, initialDelayMs: 100, backoffFactor: 2 }
  ): Promise<T> {
    let lastError: any;
    let delay = policy.initialDelayMs;

    for (let attempt = 1; attempt <= policy.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;

        // If caller supplies a retryable classifier, check it
        if (policy.retryableErrors && !policy.retryableErrors(err)) {
          throw err;
        }

        if (attempt === policy.maxRetries) break;

        // Add jitter: ±20% of delay
        const jitter = delay * 0.2 * (Math.random() - 0.5);
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        delay *= policy.backoffFactor;
      }
    }
    throw lastError;
  }
}
