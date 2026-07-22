import { BaseException } from './abstraction';

export class TimeoutException extends BaseException {
  public readonly statusCode = 504;

  constructor(message: string = 'Gateway request timed out', code: string = 'REQUEST_TIMEOUT', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
