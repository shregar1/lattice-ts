import { BaseException } from './abstraction';

export class InternalServerException extends BaseException {
  public readonly statusCode = 500;

  constructor(message: string = 'Internal server error occurred', code: string = 'INTERNAL_SERVER_ERROR', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
