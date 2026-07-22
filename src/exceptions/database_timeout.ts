import { BaseException } from './abstraction';

export class DatabaseTimeoutException extends BaseException {
  public override statusCode = 504;

  constructor(message: string = 'Database operation timed out') {
    super(message);
  }
}
