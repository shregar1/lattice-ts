import {
  NotFoundException,
  UnprocessableEntityException,
  UnauthenticatedException,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerException,
  TimeoutException,
  Exception,
} from '../../../src/exceptions';

describe('Custom Exceptions & Rust-style Enum Unit Tests', () => {
  test('Each exception should implement IException with correct status codes', () => {
    expect(new NotFoundException().statusCode).toBe(404);
    expect(new UnprocessableEntityException().statusCode).toBe(422);
    expect(new UnauthenticatedException().statusCode).toBe(401);
    expect(new UnauthorizedException().statusCode).toBe(403);
    expect(new BadRequestException().statusCode).toBe(400);
    expect(new ConflictException().statusCode).toBe(409);
    expect(new ForbiddenException().statusCode).toBe(403);
    expect(new InternalServerException().statusCode).toBe(500);
    expect(new TimeoutException().statusCode).toBe(504);
  });

  test('Rust-style Exception enum pattern matching should match correct variants', () => {
    const errEnum = Exception.NotFound('User resource missing', 'USER_NOT_FOUND');

    const result = Exception.match(errEnum, {
      NotFound: (err) => `Handled 404: ${err.message}`,
      Unauthorized: () => 'Handled 403',
      _: () => 'Default handler',
    });

    expect(result).toBe('Handled 404: User resource missing');
  });
});
