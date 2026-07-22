import { BaseException } from './abstraction';

export class UnauthorizedException extends BaseException {
  public readonly statusCode = 403;

  constructor(message: string = 'Permission denied for this resource', code: string = 'UNAUTHORIZED', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
