import { IHttpRequest, IHttpResponse } from './http';
import { BaseController } from '../abstractions/controller';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IRouteRegistration {
  method: HttpMethod;
  path: string; // Full relative path
  controller: BaseController;
  schema?: any; // Zod schema for request validation
}

export class Router {
  private routes: IRouteRegistration[] = [];
  private subRouters: { prefix: string; router: Router }[] = [];

  constructor(public readonly name: string = 'Router') {}

  /** Map an HTTP method and sub-path to a controller */
  public addRoute(method: HttpMethod, path: string, controller: BaseController, schema?: any): this {
    // Normalize path leading slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    this.routes.push({ method, path: normalizedPath, controller, schema });
    return this;
  }

  public get(path: string, controller: BaseController, schema?: any): this {
    return this.addRoute('GET', path, controller, schema);
  }

  public post(path: string, controller: BaseController, schema?: any): this {
    return this.addRoute('POST', path, controller, schema);
  }

  public put(path: string, controller: BaseController, schema?: any): this {
    return this.addRoute('PUT', path, controller, schema);
  }

  public delete(path: string, controller: BaseController, schema?: any): this {
    return this.addRoute('DELETE', path, controller, schema);
  }

  /** Nest a child router under a prefix path (e.g. .use('/v1', v1Router)) */
  public use(prefix: string, router: Router): this {
    const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    // Clean trailing slash unless it's root
    const cleanPrefix = normalizedPrefix === '/' ? '' : normalizedPrefix.replace(/\/$/, '');
    this.subRouters.push({ prefix: cleanPrefix, router });
    return this;
  }

  /** Flattens all nested routers recursively to produce absolute path registrations */
  public getFlattenedRoutes(parentPrefix: string = ''): IRouteRegistration[] {
    const result: IRouteRegistration[] = [];

    // 1. Direct routes at this level
    for (const r of this.routes) {
      const fullPath = (parentPrefix + (r.path === '/' ? '' : r.path)) || '/';
      result.push({
        ...r,
        path: fullPath,
      });
    }

    // 2. Sub-routers nested under prefixes
    for (const sub of this.subRouters) {
      const combinedPrefix = parentPrefix + sub.prefix;
      const childFlattened = sub.router.getFlattenedRoutes(combinedPrefix);
      result.push(...childFlattened);
    }

    return result;
  }
}
