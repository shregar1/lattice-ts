import { BaseException } from './abstraction';

export class DuplicateKeyException extends BaseException {
  public override statusCode = 409;

  constructor(message: string = 'Entity with unique identifier already exists') {
    super(message);
  }
}
