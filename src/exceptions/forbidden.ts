import { BaseException } from './abstraction';

export class ForbiddenException extends BaseException {
  public readonly statusCode = 403;

  constructor(message: string = 'Access to this resource is forbidden', code: string = 'FORBIDDEN', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
