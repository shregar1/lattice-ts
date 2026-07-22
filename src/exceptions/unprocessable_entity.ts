import { BaseException } from './abstraction';

export class UnprocessableEntityException extends BaseException {
  public readonly statusCode = 422;

  constructor(message: string = 'Unprocessable entity payload', code: string = 'UNPROCESSABLE_ENTITY', errors?: any[], details?: Record<string, any>) {
    super(message, code, errors, details);
  }
}
