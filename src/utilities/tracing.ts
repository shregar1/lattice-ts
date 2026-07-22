import { ModuleBaseUtility } from './abstraction';

export type SpanCategory = 'request' | 'db' | 'cache' | 'http' | 'job' | 'generic';

export interface ITraceSpan {
  spanId: string;
  parentSpanId?: string;
  name: string;
  category: SpanCategory;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  requestUrn?: string;
  correlationId?: string;
  tags: Record<string, any>;
  children: ITraceSpan[];
}

export interface ITraceContext {
  requestUrn?: string;
  correlationId?: string;
}

export class TracingUtility extends ModuleBaseUtility {
  private static activeSpans = new Map<string, ITraceSpan>();

  public static startSpan(
    name: string,
    category: SpanCategory = 'generic',
    tags: Record<string, any> = {},
    parentSpanId?: string,
    context?: ITraceContext
  ): string {
    const spanId = `span_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const span: ITraceSpan = {
      spanId,
      parentSpanId,
      name,
      category,
      startTime: performance.now(),
      requestUrn: context?.requestUrn,
      correlationId: context?.correlationId,
      tags,
      children: [],
    };

    // Attach to parent if exists
    if (parentSpanId) {
      const parent = TracingUtility.activeSpans.get(parentSpanId);
      if (parent) {
        parent.children.push(span);
      }
    }

    TracingUtility.activeSpans.set(spanId, span);
    return spanId;
  }

  public static endSpan(spanId: string): ITraceSpan | null {
    const span = TracingUtility.activeSpans.get(spanId);
    if (!span) return null;

    span.endTime = performance.now();
    span.durationMs = Number((span.endTime - span.startTime).toFixed(2));
    TracingUtility.activeSpans.delete(spanId);
    return span;
  }

  /** Convenience factory for database spans */
  public static dbSpan(operation: string, table: string, parentSpanId?: string, context?: ITraceContext): string {
    return TracingUtility.startSpan(`db.${operation}`, 'db', { table, operation }, parentSpanId, context);
  }

  /** Convenience factory for cache spans */
  public static cacheSpan(operation: string, key: string, parentSpanId?: string, context?: ITraceContext): string {
    return TracingUtility.startSpan(`cache.${operation}`, 'cache', { key, operation }, parentSpanId, context);
  }

  /** Convenience factory for external HTTP spans */
  public static httpSpan(method: string, url: string, parentSpanId?: string, context?: ITraceContext): string {
    return TracingUtility.startSpan(`http.${method.toLowerCase()}`, 'http', { method, url }, parentSpanId, context);
  }
}
