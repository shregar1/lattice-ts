"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareFactory = void 0;
const abstraction_1 = require("./abstraction");
const trusted_host_1 = require("../middleware/trusted_host");
const security_headers_1 = require("../middleware/security_headers");
const cors_1 = require("../middleware/cors");
const compression_1 = require("../middleware/compression");
const request_context_1 = require("../middleware/request_context");
const request_logger_1 = require("../middleware/request_logger");
const rate_limit_1 = require("../middleware/rate_limit");
const authentication_1 = require("../middleware/authentication");
const tenant_resolution_1 = require("../middleware/tenant_resolution");
const authorization_1 = require("../middleware/authorization");
const request_validation_1 = require("../middleware/request_validation");
const response_builder_1 = require("../middleware/response_builder");
const audit_logger_1 = require("../middleware/audit_logger");
const request_timeout_1 = require("../middleware/request_timeout");
class MiddlewareFactory extends abstraction_1.ModuleBaseFactory {
    create(type, options) {
        switch (type.toLowerCase()) {
            case 'trustedhost':
                return new trusted_host_1.TrustedHostMiddleware(options?.allowedHosts);
            case 'securityheaders':
                return new security_headers_1.SecurityHeadersMiddleware(options?.headers);
            case 'cors':
                return new cors_1.CorsMiddleware(options);
            case 'compression':
                return new compression_1.CompressionMiddleware(options?.thresholdBytes);
            case 'requestcontext':
                return new request_context_1.RequestContextMiddleware();
            case 'exceptionhandler':
                return new request_context_1.ExceptionHandlerMiddleware();
            case 'requestlogger':
                return new request_logger_1.RequestLoggerMiddleware(options?.logger);
            case 'ratelimit':
                return new rate_limit_1.RateLimitMiddleware(options?.windowMs, options?.maxRequests);
            case 'authentication':
                return new authentication_1.AuthenticationMiddleware(options?.jwtService);
            case 'tenantresolution':
                return new tenant_resolution_1.TenantResolutionMiddleware();
            case 'authorization':
                return new authorization_1.AuthorizationMiddleware(options?.roles, options?.permissions);
            case 'requestvalidation':
                return new request_validation_1.RequestValidationMiddleware(options?.schema);
            case 'responsebuilder':
                return new response_builder_1.ResponseBuilderMiddleware();
            case 'audit':
                return new audit_logger_1.AuditMiddleware(options?.logger);
            case 'requesttimeout':
                return new request_timeout_1.RequestTimeoutMiddleware(options?.timeoutMs);
            default:
                throw new Error(`Unknown middleware type '${type}'`);
        }
    }
}
exports.MiddlewareFactory = MiddlewareFactory;
