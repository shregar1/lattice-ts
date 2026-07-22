import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { UnauthorizedException } from '../exceptions/unauthorized';

export class AuthenticationMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly jwtService: any) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const authHeader = (req.headers && req.headers['authorization']) || '';
    if (!authHeader.startsWith('Bearer ')) {
      return await next();
    }

    const token = authHeader.substring(7).trim();
    try {
      const claims = await this.jwtService.verifyToken(token);
      if (req.context) {
        req.context.userId = claims.userId || claims.sub;
        req.context.tenantId = claims.tenantId;
        req.context.roles = claims.roles || [];
        req.context.permissions = claims.permissions || [];
      }
    } catch (err: any) {
      throw new UnauthorizedException('Invalid or expired authentication token', 'INVALID_TOKEN');
    }

    return await next();
  }
}
