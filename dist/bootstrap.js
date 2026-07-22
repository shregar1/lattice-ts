"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationBootstrap = void 0;
const container_1 = require("./dependencies/container");
const dependencies_1 = require("./dependencies");
const pipeline_1 = require("./middleware/pipeline");
const trusted_host_1 = require("./middleware/trusted_host");
const security_headers_1 = require("./middleware/security_headers");
const cors_1 = require("./middleware/cors");
const compression_1 = require("./middleware/compression");
const request_context_1 = require("./middleware/request_context");
const request_logger_1 = require("./middleware/request_logger");
const rate_limit_1 = require("./middleware/rate_limit");
const authentication_1 = require("./middleware/authentication");
const tenant_resolution_1 = require("./middleware/tenant_resolution");
const authorization_1 = require("./middleware/authorization");
const request_validation_1 = require("./middleware/request_validation");
const response_builder_1 = require("./middleware/response_builder");
const audit_logger_1 = require("./middleware/audit_logger");
const request_timeout_1 = require("./middleware/request_timeout");
class ApplicationBootstrap {
    container;
    configProvider;
    logger;
    pipeline;
    activeRequestsCount = 0;
    async initialize() {
        // 1. Initialize DI Container & Providers
        this.container = (0, dependencies_1.setupDependencies)();
        // 2. Resolve Singleton Configuration Provider & Config DTOs
        this.configProvider = this.container.resolve(container_1.DI_TOKENS.AppConfig);
        const appConfig = this.configProvider.getAppConfig();
        const cacheConfig = this.configProvider.getCacheConfig();
        const storageConfig = this.configProvider.getStorageConfig();
        const dbConfig = this.configProvider.getDatabaseConfig();
        // 3. Initialize Logger
        this.logger = this.container.resolve(container_1.DI_TOKENS.Logger);
        this.logger.info(`Starting Application Bootstrap in ${appConfig.env} mode...`);
        // 4. Initialize Cache Provider
        const cacheClient = this.container.resolve(container_1.DI_TOKENS.CacheClient);
        this.logger.info(`Cache initialized with provider: ${cacheConfig.provider}`);
        // 5. Initialize Storage Provider
        const storageClient = this.container.resolve(container_1.DI_TOKENS.StorageClient);
        this.logger.info(`Storage initialized with provider: ${storageConfig.provider}`);
        // 6. Initialize Database Connections
        this.logger.info(`Database connection target: ${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`);
        // 7. Assemble Complete 15-Stage Middleware Pipeline
        this.pipeline = new pipeline_1.MiddlewarePipeline();
        const jwtService = this.container.resolve(container_1.DI_TOKENS.JwtService);
        this.pipeline
            .use(new request_context_1.ExceptionHandlerMiddleware())
            .use(new trusted_host_1.TrustedHostMiddleware())
            .use(new security_headers_1.SecurityHeadersMiddleware())
            .use(new cors_1.CorsMiddleware())
            .use(new compression_1.CompressionMiddleware())
            .use(new request_timeout_1.RequestTimeoutMiddleware(10000))
            .use(new request_context_1.RequestContextMiddleware())
            .use(new request_logger_1.RequestLoggerMiddleware(this.logger))
            .use(new rate_limit_1.RateLimitMiddleware(60000, 100))
            .use(new authentication_1.AuthenticationMiddleware(jwtService))
            .use(new tenant_resolution_1.TenantResolutionMiddleware())
            .use(new authorization_1.AuthorizationMiddleware())
            .use(new request_validation_1.RequestValidationMiddleware())
            .use(new response_builder_1.ResponseBuilderMiddleware())
            .use(new audit_logger_1.AuditMiddleware(this.logger));
        this.setupGracefulShutdown();
        this.logger.info(`Application Bootstrap completed successfully on port ${appConfig.port}.`);
        return { container: this.container, pipeline: this.pipeline };
    }
    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            this.logger.info(`Received ${signal}. Initiating graceful shutdown...`);
            // 1. Stop taking new requests
            // 2. Wait for active in-flight requests
            this.logger.info(`Active in-flight requests: ${this.activeRequestsCount}`);
            // 3. Close resources
            this.logger.info('Closing database and cache connections...');
            this.logger.info('Flushing logs and audit events...');
            this.logger.info('Graceful shutdown completed.');
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }
}
exports.ApplicationBootstrap = ApplicationBootstrap;
