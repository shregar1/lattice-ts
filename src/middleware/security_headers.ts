import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';

export class SecurityHeadersMiddleware extends ModuleBaseMiddleware {
  private static readonly DISCLOSURE_HEADERS_TO_STRIP = [
    'Server',
    'X-Powered-By',
    'X-AspNet-Version',
    'X-AspNetMvc-Version',
    'X-Runtime',
    'X-Version',
    'X-Generator',
  ];

  constructor(
    private readonly customHeaders: Record<string, string> = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'",
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-XSS-Protection': '1; mode=block',
    }
  ) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const response = await next();
    const existingHeaders = { ...(response.meta?.headers || {}) };

    // Security Hardening: Strip server & framework version disclosure headers
    for (const headerKey of SecurityHeadersMiddleware.DISCLOSURE_HEADERS_TO_STRIP) {
      delete existingHeaders[headerKey];
      delete existingHeaders[headerKey.toLowerCase()];
    }

    response.meta = {
      ...response.meta,
      headers: { ...existingHeaders, ...this.customHeaders },
    };
    return response;
  }
}
