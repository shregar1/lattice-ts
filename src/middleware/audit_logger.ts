import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { ILogger } from '../utilities/logger';

export class AuditMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly logger: ILogger) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const response = await next();
    const isMutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.context?.method || '');

    if (isMutatingMethod && response.success) {
      setTimeout(() => {
        this.logger.info(`AUDIT: Action '${req.context?.method} ${req.context?.path}' executed by user '${req.context?.userId || 'ANONYMOUS'}'`, {
          requestUrn: req.context?.requestUrn,
          referenceUrn: req.context?.referenceUrn,
          userId: req.context?.userId,
          tenantId: req.context?.tenantId,
          path: req.context?.path,
          method: req.context?.method,
        });
      }, 0);
    }

    return response;
  }
}
