import { Router } from '../../../../utilities/router';
import { Container } from '../../../../dependencies/container';
import { HealthCheckController, ReadinessCheckController, LivenessCheckController, VersionCheckController, ApiDocsController } from './health';

export function createPlatformRouter(container: Container): Router {
  const router = new Router('PlatformRouter');

  const healthController = new HealthCheckController();
  const readinessController = new ReadinessCheckController();
  const livenessController = new LivenessCheckController();
  const versionController = new VersionCheckController();
  const docsController = new ApiDocsController();

  router.get('/health', healthController);
  router.get('/readiness', readinessController);
  router.get('/liveness', livenessController);
  router.get('/version', versionController);
  router.get('/docs', docsController);

  return router;
}
