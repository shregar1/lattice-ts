import { BaseException } from './abstraction';

export class UnauthenticatedException extends BaseException {
  public readonly statusCode = 401;

  constructor(message: string = 'User authentication required', code: string = 'UNAUTHENTICATED', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
