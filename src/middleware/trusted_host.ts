import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { ForbiddenException } from '../exceptions/forbidden';

export class TrustedHostMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly allowedHosts: string[] = ['localhost', '127.0.0.1']) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const hostHeader = (req.headers && (req.headers['host'] || req.headers['x-forwarded-host'])) || '';
    const host = hostHeader.split(':')[0].trim().toLowerCase();

    if (this.allowedHosts.length > 0 && !this.allowedHosts.includes(host) && !this.allowedHosts.includes('*')) {
      throw new ForbiddenException(`Host '${host}' is not allowed`, 'UNTRUSTED_HOST');
    }

    return await next();
  }
}
