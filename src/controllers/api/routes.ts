import { Router } from '../../utilities/router';
import { Container } from '../../dependencies/container';
import { createV1Router } from './v1/routes';

export function createApiRouter(container: Container): Router {
  const apiRouter = new Router('ApiRouter');

  // Nest version routers under /v1, /v2, etc.
  apiRouter.use('/v1', createV1Router(container));

  return apiRouter;
}
