import { BaseException } from './abstraction';

export class ConnectionFailureException extends BaseException {
  public override statusCode = 503;

  constructor(message: string = 'Failed to establish database connection') {
    super(message);
  }
}
