import { BaseException } from './abstraction';

export class ConflictException extends BaseException {
  public readonly statusCode = 409;

  constructor(message: string = 'Resource state conflict occurred', code: string = 'CONFLICT', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
