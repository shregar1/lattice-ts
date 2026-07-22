import { BaseException } from './abstraction';

export class BadRequestException extends BaseException {
  public readonly statusCode = 400;

  constructor(message: string = 'Bad request syntax or payload', code: string = 'BAD_REQUEST', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
