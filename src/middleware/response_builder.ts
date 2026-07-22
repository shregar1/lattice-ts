import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BaseResponseEnvelopeDTO } from '../dto/controller/responses/base_envelope';

export class ResponseBuilderMiddleware extends ModuleBaseMiddleware {
  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const response = await next();

    // Check environment flag ENABLE_PERFORMANCE_METRICS
    const enableMetrics = process.env.ENABLE_PERFORMANCE_METRICS === 'true';

    let metadata: Record<string, any> = response.meta || {};
    if (enableMetrics && req.context) {
      const totalLatencyMs = Date.now() - req.context.startTime;

      // Group sub-stage durations by high-level category
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

    if (response.data instanceof BaseResponseEnvelopeDTO) {
      if (enableMetrics) {
        (response.data as any).metadata = {
          ...response.data.metadata,
          ...metadata,
        };
      } else {
        // Guarantee no internal statistics leak when disabled
        delete (response.data as any).metadata?.statistics;
      }
      return response;
    }

    const envelope = new BaseResponseEnvelopeDTO({
      transactionUrn: req.context?.requestUrn || '',
      status: response.success ? 'SUCCESS' : 'FAILED',
      responseMessage: response.message || 'Operation executed',
      responseKey: response.success ? 'SUCCESS' : 'ERROR',
      errors: response.errors || [],
      timestamp: new Date().toISOString(),
      metadata,
      data: response.data,
      referenceUrn: req.context?.referenceUrn || '',
    });

    return {
      statusCode: response.statusCode,
      success: response.success,
      message: response.message,
      data: envelope,
      meta: response.meta,
    };
  }
}
