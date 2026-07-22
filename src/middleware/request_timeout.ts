import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BaseException } from '../exceptions/abstraction';

export class RequestTimeoutException extends BaseException {
  public readonly statusCode = 504;
  constructor(message: string = 'Request Gateway Timeout', code: string = 'REQUEST_TIMEOUT') {
    super(message, code);
  }
}

export class RequestTimeoutMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly timeoutMs: number = 10000) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    let timer: NodeJS.Timeout;

    const timeoutPromise = new Promise<IHttpResponse>((_, reject) => {
      timer = setTimeout(() => {
        reject(new RequestTimeoutException(`Request timed out after ${this.timeoutMs}ms`));
      }, this.timeoutMs);
    });

    try {
      const response = await Promise.race([next(), timeoutPromise]);
      clearTimeout(timer!);
      return response;
    } catch (error) {
      clearTimeout(timer!);
      throw error;
    }
  }
}
