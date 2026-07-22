import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';
import { Router } from './router';

export interface IRouteMetadata {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  version?: string;
  description?: string;
  authRequired?: boolean;
  roles?: string[];
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  deprecated?: boolean;
  deprecatedSince?: string;
}

class RouteRegistryClass extends ModuleBaseUtility {
  private readonly routes: IRouteMetadata[] = [];
  public readonly logger: ILogger;

  constructor() {
    super();
    this.logger = new StructuredLogger('RouteRegistry');
  }

  public register(metadata: IRouteMetadata): void {
    this.routes.push(metadata);
    if (metadata.deprecated) {
      this.logger.warn(`Route ${metadata.method} ${metadata.path} is DEPRECATED since ${metadata.deprecatedSince}`);
    }
  }

  /** Sync nested router tree into RouteRegistry */
  public registerRouter(rootRouter: Router): void {
    const flattened = rootRouter.getFlattenedRoutes();
    for (const r of flattened) {
      this.register({
        method: r.method,
        path: r.path,
        requestSchema: r.schema,
        authRequired: !r.path.includes('/auth/'),
      });
    }
    this.logger.info(`Registered ${flattened.length} routes from nested Router tree`);
  }

  public getAll(): IRouteMetadata[] {
    return [...this.routes];
  }

  /** Generate a structured JSON API specification */
  public generateSpec(): Record<string, any> {
    const spec: Record<string, any> = {
      title: 'Backend Service API',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      routes: {},
    };

    for (const route of this.routes) {
      const key = `${route.method} ${route.path}`;
      spec.routes[key] = {
        method: route.method,
        path: route.path,
        description: route.description,
        authRequired: route.authRequired ?? true,
        roles: route.roles ?? [],
        deprecated: route.deprecated ?? false,
        deprecatedSince: route.deprecatedSince,
        requestSchema: route.requestSchema ?? null,
        responseSchema: route.responseSchema ?? null,
      };
    }

    return spec;
  }
}

export const RouteRegistry = new RouteRegistryClass();
