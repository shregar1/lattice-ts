import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { ILogger } from '../utilities/logger';

export class RequestLoggerMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly logger: ILogger) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const response = await next();
    const ctx = req.context;
    const latencyMs = ctx ? Date.now() - ctx.startTime : 0;

    this.logger.info(`HTTP ${ctx?.method || 'GET'} ${ctx?.path || '/'} - ${response.statusCode} (${latencyMs}ms)`, {
      requestUrn: ctx?.requestUrn,
      referenceUrn: ctx?.referenceUrn,
      correlationId: ctx?.correlationId,
      method: ctx?.method,
      path: ctx?.path,
      statusCode: response.statusCode,
      latencyMs,
      clientIp: ctx?.clientIp,
      userId: ctx?.userId,
      tenantId: ctx?.tenantId,
    });

    return response;
  }
}
