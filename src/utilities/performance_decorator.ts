import 'reflect-metadata';

export interface IExecutionMetrics {
  stage: string;
  durationMs: number;
}

export function MeasurePerformance(stageCategory: 'controller' | 'orchestrator' | 'service' | 'repository' = 'service') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const durationMs = Number((performance.now() - start).toFixed(2));

        if ((this as any).logger) {
          (this as any).logger.info(`[Internal Performance Audit] ${stageCategory} execution took ${durationMs}ms`);
        }

        // Attach sanitized stage duration to RequestContext
        const reqContext = args.find((a) => a && (a.requestUrn || a.context?.requestUrn));
        if (reqContext) {
          const ctx = reqContext.context || reqContext;
          ctx.metrics = ctx.metrics || [];
          ctx.metrics.push({ stage: stageCategory, durationMs });
        }

        return result;
      } catch (error) {
        const durationMs = Number((performance.now() - start).toFixed(2));
        if ((this as any).logger) {
          (this as any).logger.error(`[Internal Performance Audit] ${stageCategory} failed after ${durationMs}ms`);
        }
        throw error;
      }
    };

    return descriptor;
  };
}
