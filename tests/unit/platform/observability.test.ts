import { TracingUtility } from '../../../src/utilities/tracing';
import { FeatureFlagUtility } from '../../../src/utilities/feature_flags';
import { SchedulerUtility } from '../../../src/utilities/scheduler';

describe('Prompt 8 Production Readiness & Observability Unit Tests', () => {
  afterEach(() => {
    FeatureFlagUtility.clearAll();
  });

  test('TracingUtility should track active spans and calculate duration', () => {
    const spanId = TracingUtility.startSpan('DatabaseQuery', 'db', { table: 'users' });
    expect(spanId).toMatch(/^span_/);

    const span = TracingUtility.endSpan(spanId);
    expect(span).not.toBeNull();
    expect(span?.name).toBe('DatabaseQuery');
    expect(span?.category).toBe('db');
    expect(span?.durationMs).toBeGreaterThanOrEqual(0);
  });

  test('TracingUtility should support nested parent-child spans', () => {
    const parentId = TracingUtility.startSpan('HttpRequest', 'request');
    const childId = TracingUtility.startSpan('DbQuery', 'db', {}, parentId);

    const child = TracingUtility.endSpan(childId);
    const parent = TracingUtility.endSpan(parentId);

    expect(child?.parentSpanId).toBe(parentId);
    expect(parent?.durationMs).toBeGreaterThanOrEqual(0);
  });

  test('TracingUtility convenience factories should produce correctly categorised spans', () => {
    const dbId = TracingUtility.dbSpan('SELECT', 'users');
    const cacheId = TracingUtility.cacheSpan('GET', 'user:123');
    const httpId = TracingUtility.httpSpan('GET', 'https://example.com/api');

    const dbSpan = TracingUtility.endSpan(dbId);
    const cacheSpan = TracingUtility.endSpan(cacheId);
    const httpSpan = TracingUtility.endSpan(httpId);

    expect(dbSpan?.category).toBe('db');
    expect(cacheSpan?.category).toBe('cache');
    expect(httpSpan?.category).toBe('http');
  });

  test('FeatureFlagUtility should evaluate global feature flags', () => {
    FeatureFlagUtility.setFlag('new_user_onboarding', true);
    expect(FeatureFlagUtility.isEnabled('new_user_onboarding')).toBe(true);

    FeatureFlagUtility.setFlag('new_user_onboarding', false);
    expect(FeatureFlagUtility.isEnabled('new_user_onboarding')).toBe(false);

    expect(FeatureFlagUtility.isEnabled('non_existent_flag')).toBe(false);
  });

  test('FeatureFlagUtility should apply tenant overrides', () => {
    FeatureFlagUtility.setFlag('beta_dashboard', {
      enabled: false,
      tenantOverrides: { tenant_vip: true },
    });

    expect(FeatureFlagUtility.isEnabled('beta_dashboard')).toBe(false);
    expect(FeatureFlagUtility.isEnabled('beta_dashboard', { tenantId: 'tenant_vip' })).toBe(true);
    expect(FeatureFlagUtility.isEnabled('beta_dashboard', { tenantId: 'tenant_normal' })).toBe(false);
  });

  test('FeatureFlagUtility should apply percentage rollout deterministically', () => {
    FeatureFlagUtility.setFlag('gradual_rollout', {
      enabled: false,
      rolloutPercentage: 100, // all users should receive it
    });
    expect(FeatureFlagUtility.isEnabled('gradual_rollout', { userId: 'user_abc' })).toBe(true);

    FeatureFlagUtility.setFlag('gradual_rollout_off', {
      enabled: false,
      rolloutPercentage: 0, // no users should receive it
    });
    expect(FeatureFlagUtility.isEnabled('gradual_rollout_off', { userId: 'user_abc' })).toBe(false);
  });

  test('SchedulerUtility should schedule and cancel recurring tasks', () => {
    const scheduler = new SchedulerUtility();
    const handler = jest.fn().mockResolvedValue(undefined);

    scheduler.scheduleRecurring('test_cron', 10000, handler);
    expect(scheduler.cancel('test_cron')).toBe(true);
    expect(scheduler.cancel('test_cron')).toBe(false);
    scheduler.stopAll();
  });
});
