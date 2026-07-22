import { RegisterRequestSchema } from '../../../src/validators/auth';
import { RequestValidationMiddleware } from '../../../src/middleware/request_validation';
import { RegisterRequestDTO } from '../../../src/dto/controller/requests/auth';

describe('Zod Validation Middleware Unit Tests', () => {
  test('RequestValidationMiddleware should pass valid Zod payload', async () => {
    const middleware = new RequestValidationMiddleware(RegisterRequestSchema);
    const validDto = new RegisterRequestDTO('john@example.com', 'secret123', 'John', 'Doe');

    const req: any = { body: validDto };
    let called = false;
    await middleware.handle(req, async () => {
      called = true;
      return { statusCode: 200, success: true, message: 'OK' };
    });

    expect(called).toBe(true);
  });

  test('RequestValidationMiddleware should throw 400 for invalid Zod payload', async () => {
    const middleware = new RequestValidationMiddleware(RegisterRequestSchema);
    const invalidDto = new RegisterRequestDTO('invalid-email', 'short', '', '');

    const req: any = { body: invalidDto };
    let errorCaught: any = null;
    try {
      await middleware.handle(req, async () => ({ statusCode: 200, success: true, message: 'OK' }));
    } catch (err: any) {
      errorCaught = err;
    }

    expect(errorCaught).not.toBeNull();
    expect(errorCaught.statusCode).toBe(400);
    expect(errorCaught.errors).toContain('email: Invalid email address format');
    expect(errorCaught.errors).toContain('password: Password must be at least 8 characters long');
  });
});
