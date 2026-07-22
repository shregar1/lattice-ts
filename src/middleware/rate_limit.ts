import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BaseException } from '../exceptions/abstraction';

export class RateLimitExceededException extends BaseException {
  public readonly statusCode = 429;
  constructor(message: string = 'Too Many Requests', code: string = 'RATE_LIMIT_EXCEEDED') {
    super(message, code);
  }
}

export class RateLimitMiddleware extends ModuleBaseMiddleware {
  private static ipHits = new Map<string, { count: number; expiresAt: number }>();

  constructor(
    private readonly windowMs: number = 60000,
    private readonly maxRequests: number = 100
  ) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const key = req.context?.userId || req.context?.tenantId || req.context?.clientIp || '127.0.0.1';
    const now = Date.now();
    const hit = RateLimitMiddleware.ipHits.get(key) || { count: 0, expiresAt: now + this.windowMs };

    if (now > hit.expiresAt) {
      hit.count = 1;
      hit.expiresAt = now + this.windowMs;
    } else {
      hit.count++;
    }

    RateLimitMiddleware.ipHits.set(key, hit);

    if (hit.count > this.maxRequests) {
      throw new RateLimitExceededException(`Rate limit exceeded. Try again in ${Math.ceil((hit.expiresAt - now) / 1000)}s`);
    }

    const response = await next();
    const remaining = Math.max(0, this.maxRequests - hit.count);
    response.meta = {
      ...response.meta,
      headers: {
        ...(response.meta?.headers || {}),
        'X-RateLimit-Limit': String(this.maxRequests),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(Math.ceil(hit.expiresAt / 1000)),
      },
    };
    return response;
  }
}
