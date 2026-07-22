import { RetryUtility } from '../../../src/utilities/retry';
import { IdempotencyUtility } from '../../../src/utilities/idempotency';
import { EventBusUtility } from '../../../src/utilities/events';
import { BackgroundTaskUtility } from '../../../src/utilities/background_tasks';
import { InMemoryCacheClient } from '../../../src/utilities/cache';

describe('Prompt 6 Reusable Platform Services Unit Tests', () => {
  test('RetryUtility should retry failing operation and succeed', async () => {
    let attempts = 0;
    const operation = jest.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 2) throw new Error('Temporary failure');
      return 'success';
    });

    const result = await RetryUtility.executeWithRetry(operation, {
      maxRetries: 3,
      initialDelayMs: 10,
      backoffFactor: 2,
    });

    expect(result).toBe('success');
    expect(attempts).toBe(2);
  });

  test('IdempotencyUtility should return cached response on replay key', async () => {
    const cache = new InMemoryCacheClient();
    const idempotency = new IdempotencyUtility(cache);
    const operation = jest.fn().mockResolvedValue({ status: 'PROCESSED' });

    const res1 = await idempotency.executeIdempotent('key_123', operation);
    expect(res1).toEqual({ status: 'PROCESSED' });
    expect(operation).toHaveBeenCalledTimes(1);

    const res2 = await idempotency.executeIdempotent('key_123', operation);
    expect(res2).toEqual({ status: 'PROCESSED' });
    expect(operation).toHaveBeenCalledTimes(1); // Replayed, no second call
  });

  test('EventBusUtility should publish events to subscribers', async () => {
    const handler = jest.fn().mockResolvedValue(undefined);
    EventBusUtility.subscribe('user.registered', handler);

    await EventBusUtility.publish('user.registered', { userId: 'usr_1' });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].payload).toEqual({ userId: 'usr_1' });

    EventBusUtility.clearHandlers();
  });

  test('BackgroundTaskUtility should process enqueued background jobs', async () => {
    const processor = jest.fn().mockResolvedValue(undefined);
    BackgroundTaskUtility.registerProcessor('send_welcome_email', processor);

    const jobId = await BackgroundTaskUtility.enqueue('send_welcome_email', { email: 'user@example.com' });
    expect(jobId).toMatch(/^job_/);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(processor).toHaveBeenCalled();
  });
});
