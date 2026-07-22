export interface IException {
  readonly message: string;
  readonly code: string;
  readonly statusCode: number;
  readonly errors?: any[];
  readonly details?: Record<string, any>;
}

export abstract class BaseException extends Error implements IException {
  public abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly errors?: any[],
    public readonly details?: Record<string, any>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
