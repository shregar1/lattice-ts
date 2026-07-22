import { Router } from '../utilities/router';
import { Container } from '../dependencies/container';
import { createApiRouter } from './api/routes';

export function createApplicationRouter(container: Container): Router {
  const rootRouter = new Router('RootRouter');

  // Nest API router under /api
  rootRouter.use('/api', createApiRouter(container));

  return rootRouter;
}
