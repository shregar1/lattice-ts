import { IMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';

export class MiddlewarePipeline {
  private middlewares: IMiddleware[] = [];

  public use(middleware: IMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  public async execute(req: IHttpRequest, targetHandler: (req: IHttpRequest) => Promise<IHttpResponse>): Promise<IHttpResponse> {
    let index = -1;

    const dispatch = async (i: number): Promise<IHttpResponse> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;

      if (i === this.middlewares.length) {
        return await targetHandler(req);
      }

      const middleware = this.middlewares[i];
      return await middleware.handle(req, () => dispatch(i + 1));
    };

    return await dispatch(0);
  }
}
