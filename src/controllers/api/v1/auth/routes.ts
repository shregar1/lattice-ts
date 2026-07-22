import { Router } from '../../../../utilities/router';
import { Container, DI_TOKENS } from '../../../../dependencies/container';
import { RegisterController } from './register';
import { LoginController } from './login';
import { RegisterRequestSchema, LoginRequestSchema } from '../../../../dto/controller/requests/auth';

export function createAuthRouter(container: Container): Router {
  const router = new Router('AuthRouter');

  const registerController = container.resolve<RegisterController>(DI_TOKENS.RegisterController);
  const loginController = container.resolve<LoginController>(DI_TOKENS.LoginController);

  router.post('/register', registerController, RegisterRequestSchema);
  router.post('/login', loginController, LoginRequestSchema);

  return router;
}
