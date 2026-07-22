import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BadRequestException } from '../exceptions/bad_request';

export class TenantResolutionMiddleware extends ModuleBaseMiddleware {
  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const headers = req.headers || {};
    const tenantIdHeader = (headers['x-tenant-id'] as string) || (req.context?.tenantId as string);

    if (tenantIdHeader) {
      if (req.context) {
        req.context.tenantId = tenantIdHeader;
      }
    }

    return await next();
  }
}
