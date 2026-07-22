import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { ForbiddenException } from '../exceptions/forbidden';

export class AuthorizationMiddleware extends ModuleBaseMiddleware {
  constructor(
    private readonly requiredRoles: string[] = [],
    private readonly requiredPermissions: string[] = []
  ) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const userRoles = req.context?.roles || [];
    const userPermissions = req.context?.permissions || [];

    if (this.requiredRoles.length > 0) {
      const hasRole = this.requiredRoles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role privileges', 'INSUFFICIENT_ROLE');
      }
    }

    if (this.requiredPermissions.length > 0) {
      const hasPermission = this.requiredPermissions.some((perm) => userPermissions.includes(perm));
      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions', 'INSUFFICIENT_PERMISSION');
      }
    }

    return await next();
  }
}
