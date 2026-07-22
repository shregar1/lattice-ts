import { BaseException } from './abstraction';

export class ConcurrencyConflictException extends BaseException {
  public override statusCode = 409;

  constructor(message: string = 'Optimistic locking concurrency conflict detected') {
    super(message);
  }
}
