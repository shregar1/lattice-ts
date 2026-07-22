import { IHttpRequest, IHttpResponse } from '../utilities/http';

export interface IMiddleware {
  handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse>;
}

export abstract class BaseMiddleware implements IMiddleware {
  public abstract handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse>;
}
