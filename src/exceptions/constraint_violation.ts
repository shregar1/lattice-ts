import { BaseException } from './abstraction';

export class ConstraintViolationException extends BaseException {
  public override statusCode = 400;

  constructor(message: string = 'Database constraint violation') {
    super(message);
  }
}
