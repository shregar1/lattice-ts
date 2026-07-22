import { createApplicationRouter } from '../../../src/controllers/routes';
import { setupDependencies } from '../../../src/dependencies';
import { RouteRegistry } from '../../../src/utilities/api_docs';

describe('Hierarchical Router Tree Unit Tests', () => {
  test('Application root router flattens nested routes into full URL paths', () => {
    const container = setupDependencies();
    const appRouter = createApplicationRouter(container);

    const routes = appRouter.getFlattenedRoutes();

    const paths = routes.map((r) => `${r.method} ${r.path}`);

    // Verify /api/v1 prefixing across nested routes
    expect(paths).toContain('POST /api/v1/auth/register');
    expect(paths).toContain('POST /api/v1/auth/login');
    expect(paths).toContain('GET /api/v1/platform/health');
    expect(paths).toContain('GET /api/v1/platform/readiness');
    expect(paths).toContain('GET /api/v1/platform/liveness');
    expect(paths).toContain('GET /api/v1/platform/version');
  });

  test('RouteRegistry registers all flattened routes from router tree', () => {
    const container = setupDependencies();
    const appRouter = createApplicationRouter(container);

    RouteRegistry.registerRouter(appRouter);
    const spec = RouteRegistry.generateSpec();

    expect(spec.routes['POST /api/v1/auth/register']).toBeDefined();
    expect(spec.routes['GET /api/v1/platform/health']).toBeDefined();
  });
});
