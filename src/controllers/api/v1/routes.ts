import { Router } from '../../../utilities/router';
import { Container } from '../../../dependencies/container';
import { createAuthRouter } from './auth/routes';
import { createPlatformRouter } from './platform/routes';

export function createV1Router(container: Container): Router {
  const v1Router = new Router('V1Router');

  // Nest lower-level feature routers under their prefixes
  v1Router.use('/auth', createAuthRouter(container));
  v1Router.use('/platform', createPlatformRouter(container));

  return v1Router;
}
