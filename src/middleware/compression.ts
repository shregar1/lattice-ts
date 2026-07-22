import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';

export class CompressionMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly thresholdBytes: number = 1024) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    const response = await next();
    const payloadLength = response.data ? JSON.stringify(response.data).length : 0;
    if (payloadLength >= this.thresholdBytes) {
      response.meta = {
        ...response.meta,
        headers: { ...(response.meta?.headers || {}), 'Content-Encoding': 'gzip' },
      };
    }
    return response;
  }
}
