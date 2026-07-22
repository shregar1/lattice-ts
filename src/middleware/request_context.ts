import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BaseResponseEnvelopeDTO } from '../dto/controller/responses/base_envelope';

export class RequestContextMiddleware extends ModuleBaseMiddleware {
  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const startTime = Date.now();

    // Preserve existing metrics array if attached upstream
    const existingMetrics = req.context?.metrics || [];

    req.context = {
      requestUrn: (req.headers && req.headers['x-request-id']) || `urn:request:${this.generateUuid()}`,
      referenceUrn: `urn:ref:${this.generateUuid()}`,
      correlationId: (req.headers && req.headers['x-correlation-id']) || this.generateUuid(),
      startTime,
      clientIp: req.headers && req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '127.0.0.1',
      userAgent: (req.headers && req.headers['user-agent']) || 'Unknown',
      path: (req.headers && req.headers['path']) || '/',
      method: (req.headers && req.headers['method']) || 'GET',
      userId: undefined,
      tenantId: req.headers && req.headers['x-tenant-id'],
      metrics: existingMetrics,
    };

    return await next();
  }

  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export class ExceptionHandlerMiddleware extends ModuleBaseMiddleware {
  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    try {
      return await next();
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const responseKey = error.responseKey || 'INTERNAL_SERVER_ERROR';
      const message = error.message || 'An unexpected error occurred';
      const errors = error.errors || [message];

      const envelope = new BaseResponseEnvelopeDTO({
        transactionUrn: req.context?.requestUrn || '',
        status: 'FAILED',
        responseMessage: message,
        responseKey,
        errors,
        timestamp: new Date().toISOString(),
        metadata: {},
        data: null,
        referenceUrn: req.context?.referenceUrn || '',
      });

      return {
        statusCode,
        success: false,
        message,
        data: envelope,
      };
    }
  }
}
