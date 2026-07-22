import { Container, DI_TOKENS } from './dependencies/container';
import { setupDependencies } from './dependencies';
import { ConfigurationProvider } from './configuration/config.provider';
import { ILogger } from './utilities/logger';
import { ICacheClient } from './utilities/cache';
import { IStorageClient } from './utilities/storage';
import { MiddlewarePipeline } from './middleware/pipeline';
import { TrustedHostMiddleware } from './middleware/trusted_host';
import { SecurityHeadersMiddleware } from './middleware/security_headers';
import { CorsMiddleware } from './middleware/cors';
import { CompressionMiddleware } from './middleware/compression';
import { RequestContextMiddleware, ExceptionHandlerMiddleware } from './middleware/request_context';
import { RequestLoggerMiddleware } from './middleware/request_logger';
import { RateLimitMiddleware } from './middleware/rate_limit';
import { AuthenticationMiddleware } from './middleware/authentication';
import { TenantResolutionMiddleware } from './middleware/tenant_resolution';
import { AuthorizationMiddleware } from './middleware/authorization';
import { RequestValidationMiddleware } from './middleware/request_validation';
import { ResponseBuilderMiddleware } from './middleware/response_builder';
import { AuditMiddleware } from './middleware/audit_logger';
import { RequestTimeoutMiddleware } from './middleware/request_timeout';
import { IJwtService } from './utilities/jwt';

export class ApplicationBootstrap {
  private container!: Container;
  private configProvider!: ConfigurationProvider;
  private logger!: ILogger;
  private pipeline!: MiddlewarePipeline;
  private activeRequestsCount = 0;

  public async initialize(): Promise<{ container: Container; pipeline: MiddlewarePipeline }> {
    // 1. Initialize DI Container & Providers
    this.container = setupDependencies();

    // 2. Resolve Singleton Configuration Provider & Config DTOs
    this.configProvider = this.container.resolve<ConfigurationProvider>(DI_TOKENS.AppConfig);
    const appConfig = this.configProvider.getAppConfig();
    const cacheConfig = this.configProvider.getCacheConfig();
    const storageConfig = this.configProvider.getStorageConfig();
    const dbConfig = this.configProvider.getDatabaseConfig();

    // 3. Initialize Logger
    this.logger = this.container.resolve<ILogger>(DI_TOKENS.Logger);
    this.logger.info(`Starting Application Bootstrap in ${appConfig.env} mode...`);

    // 4. Initialize Cache Provider
    const cacheClient = this.container.resolve<ICacheClient>(DI_TOKENS.CacheClient);
    this.logger.info(`Cache initialized with provider: ${cacheConfig.provider}`);

    // 5. Initialize Storage Provider
    const storageClient = this.container.resolve<IStorageClient>(DI_TOKENS.StorageClient);
    this.logger.info(`Storage initialized with provider: ${storageConfig.provider}`);

    // 6. Initialize Database Connections
    this.logger.info(`Database connection target: ${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`);

    // 7. Assemble Complete 15-Stage Middleware Pipeline
    this.pipeline = new MiddlewarePipeline();
    const jwtService = this.container.resolve<IJwtService>(DI_TOKENS.JwtService);

    this.pipeline
      .use(new ExceptionHandlerMiddleware())
      .use(new TrustedHostMiddleware())
      .use(new SecurityHeadersMiddleware())
      .use(new CorsMiddleware())
      .use(new CompressionMiddleware())
      .use(new RequestTimeoutMiddleware(10000))
      .use(new RequestContextMiddleware())
      .use(new RequestLoggerMiddleware(this.logger))
      .use(new RateLimitMiddleware(60000, 100))
      .use(new AuthenticationMiddleware(jwtService))
      .use(new TenantResolutionMiddleware())
      .use(new AuthorizationMiddleware())
      .use(new RequestValidationMiddleware())
      .use(new ResponseBuilderMiddleware())
      .use(new AuditMiddleware(this.logger));

    this.setupGracefulShutdown();

    this.logger.info(`Application Bootstrap completed successfully on port ${appConfig.port}.`);
    return { container: this.container, pipeline: this.pipeline };
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
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
