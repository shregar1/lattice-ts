import { BaseException } from './abstraction';

export class NotFoundException extends BaseException {
  public readonly statusCode = 404;

  constructor(message: string = 'Requested resource not found', code: string = 'RESOURCE_NOT_FOUND', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
