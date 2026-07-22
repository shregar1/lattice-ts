import { ModuleBaseFactory } from './abstraction';
import { TrustedHostMiddleware } from '../middleware/trusted_host';
import { SecurityHeadersMiddleware } from '../middleware/security_headers';
import { CorsMiddleware } from '../middleware/cors';
import { CompressionMiddleware } from '../middleware/compression';
import { RequestContextMiddleware, ExceptionHandlerMiddleware } from '../middleware/request_context';
import { RequestLoggerMiddleware } from '../middleware/request_logger';
import { RateLimitMiddleware } from '../middleware/rate_limit';
import { AuthenticationMiddleware } from '../middleware/authentication';
import { TenantResolutionMiddleware } from '../middleware/tenant_resolution';
import { AuthorizationMiddleware } from '../middleware/authorization';
import { RequestValidationMiddleware } from '../middleware/request_validation';
import { ResponseBuilderMiddleware } from '../middleware/response_builder';
import { AuditMiddleware } from '../middleware/audit_logger';
import { RequestTimeoutMiddleware } from '../middleware/request_timeout';
import { IMiddleware } from '../middleware/abstraction';

export class MiddlewareFactory extends ModuleBaseFactory<IMiddleware> {
  public create(type: string, options?: any): IMiddleware {
    switch (type.toLowerCase()) {
      case 'trustedhost':
        return new TrustedHostMiddleware(options?.allowedHosts);
      case 'securityheaders':
        return new SecurityHeadersMiddleware(options?.headers);
      case 'cors':
        return new CorsMiddleware(options);
      case 'compression':
        return new CompressionMiddleware(options?.thresholdBytes);
      case 'requestcontext':
        return new RequestContextMiddleware();
      case 'exceptionhandler':
        return new ExceptionHandlerMiddleware();
      case 'requestlogger':
        return new RequestLoggerMiddleware(options?.logger);
      case 'ratelimit':
        return new RateLimitMiddleware(options?.windowMs, options?.maxRequests);
      case 'authentication':
        return new AuthenticationMiddleware(options?.jwtService);
      case 'tenantresolution':
        return new TenantResolutionMiddleware();
      case 'authorization':
        return new AuthorizationMiddleware(options?.roles, options?.permissions);
      case 'requestvalidation':
        return new RequestValidationMiddleware(options?.schema);
      case 'responsebuilder':
        return new ResponseBuilderMiddleware();
      case 'audit':
        return new AuditMiddleware(options?.logger);
      case 'requesttimeout':
        return new RequestTimeoutMiddleware(options?.timeoutMs);
      default:
        throw new Error(`Unknown middleware type '${type}'`);
    }
  }
}
