import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BaseResponseEnvelopeDTO } from '../dto/controller/responses/base_envelope';

export class ResponseBuilderMiddleware extends ModuleBaseMiddleware {
  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const response = await next();

    const enableMetrics = process.env.ENABLE_PERFORMANCE_METRICS === 'true';
    const totalLatencyMs = req.context?.startTime ? Date.now() - req.context.startTime : 0;

    // 1. Attach Standard Response Headers
    const headers: Record<string, string> = {
      ...(response.meta?.headers || {}),
      'X-Request-URN': req.context?.requestUrn || req.headers?.['x-request-urn'] || '',
      'X-Reference-URN': req.context?.referenceUrn || req.headers?.['x-reference-urn'] || '',
      'X-Correlation-ID': req.context?.correlationId || req.headers?.['x-correlation-id'] || '',
      'X-RateLimit-Limit': (req.context as any)?.rateLimit?.limit?.toString() || req.headers?.['x-ratelimit-limit'] || '100',
      'X-RateLimit-Remaining': (req.context as any)?.rateLimit?.remaining?.toString() || req.headers?.['x-ratelimit-remaining'] || '99',
      'X-RateLimit-Reset': (req.context as any)?.rateLimit?.reset?.toString() || req.headers?.['x-ratelimit-reset'] || Math.floor((Date.now() + 60000) / 1000).toString(),
      'X-Response-Time-MS': `${totalLatencyMs}ms`,
    };

    let metadata: Record<string, any> = response.meta || {};
    if (enableMetrics && req.context) {
      const stageSummaries: Record<string, number> = {};
      if (req.context.metrics) {
        for (const metric of req.context.metrics) {
          const stageKey = metric.stage || 'service';
          stageSummaries[stageKey] = Number(((stageSummaries[stageKey] || 0) + metric.durationMs).toFixed(2));
        }
      }

      metadata = {
        ...metadata,
        statistics: {
          totalLatencyMs,
          stagesMs: stageSummaries,
        },
      };
    }

    // 2. Generate Standard Response Envelope
    let envelopeData: any = response.data;
    if (response.data instanceof BaseResponseEnvelopeDTO) {
      if (enableMetrics) {
        (response.data as any).metadata = {
          ...response.data.metadata,
          ...metadata,
        };
      } else {
        delete (response.data as any).metadata?.statistics;
      }
      envelopeData = response.data;
    } else {
      envelopeData = new BaseResponseEnvelopeDTO({
        transactionUrn: req.context?.requestUrn || '',
        status: response.success ? 'SUCCESS' : 'FAILED',
        responseMessage: response.message || 'Operation executed successfully',
        responseKey: response.success ? 'SUCCESS' : 'ERROR',
        errors: response.errors || [],
        timestamp: new Date().toISOString(),
        metadata,
        data: response.data,
        referenceUrn: req.context?.referenceUrn || '',
      });
    }

    return {
      statusCode: response.statusCode,
      success: response.success,
      message: response.message,
      data: envelopeData,
      meta: {
        ...response.meta,
        headers,
      },
    };
  }
}
