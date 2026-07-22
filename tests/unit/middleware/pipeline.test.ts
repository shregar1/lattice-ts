import { TrustedHostMiddleware } from '../../../src/middleware/trusted_host';
import { SecurityHeadersMiddleware } from '../../../src/middleware/security_headers';
import { AuthorizationMiddleware } from '../../../src/middleware/authorization';

describe('Middleware Pipeline Unit Tests', () => {
  test('TrustedHostMiddleware should pass allowed host and reject unknown host', async () => {
    const middleware = new TrustedHostMiddleware(['allowed.com']);

    const reqValid: any = { headers: { host: 'allowed.com' } };
    let called = false;
    await middleware.handle(reqValid, async () => {
      called = true;
      return { statusCode: 200, success: true, message: 'OK' };
    });
    expect(called).toBe(true);

    const reqInvalid: any = { headers: { host: 'malicious.com' } };
    let errorCaught: any = null;
    try {
      await middleware.handle(reqInvalid, async () => ({ statusCode: 200, success: true, message: 'OK' }));
    } catch (err: any) {
      errorCaught = err;
    }
    expect(errorCaught).not.toBeNull();
    expect(errorCaught.message).toBe("Host 'malicious.com' is not allowed");
  });

  test('SecurityHeadersMiddleware should inject standard security headers', async () => {
    const middleware = new SecurityHeadersMiddleware();
    const req: any = { headers: {} };

    const res = await middleware.handle(req, async () => ({ statusCode: 200, success: true, message: 'OK' }));
    expect(res.meta?.headers['X-Frame-Options']).toBe('DENY');
    expect(res.meta?.headers['X-Content-Type-Options']).toBe('nosniff');
  });

  test('AuthorizationMiddleware should enforce required roles', async () => {
    const middleware = new AuthorizationMiddleware(['ADMIN']);
    const reqUnauth: any = { context: { roles: ['USER'] } };

    let errorCaught: any = null;
    try {
      await middleware.handle(reqUnauth, async () => ({ statusCode: 200, success: true, message: 'OK' }));
    } catch (err: any) {
      errorCaught = err;
    }
    expect(errorCaught).not.toBeNull();
    expect(errorCaught.message).toBe('Insufficient role privileges');

    const reqAuth: any = { context: { roles: ['ADMIN'] } };
    const res = await middleware.handle(reqAuth, async () => ({ statusCode: 200, success: true, message: 'OK' }));
    expect(res.statusCode).toBe(200);
  });
});
