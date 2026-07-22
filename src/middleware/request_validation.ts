import { ModuleBaseMiddleware } from './abstraction';
import { IHttpRequest, IHttpResponse } from '../utilities/http';
import { BadRequestException } from '../exceptions/bad_request';
import { ZodSchema } from 'zod';

export class RequestValidationMiddleware extends ModuleBaseMiddleware {
  constructor(private readonly schema?: ZodSchema<any> | ((body: any) => string[] | null)) {
    super();
  }

  public async handle(req: IHttpRequest, next: () => Promise<IHttpResponse>): Promise<IHttpResponse> {
    if (this.schema && req.body) {
      if (typeof this.schema === 'function') {
        const errors = this.schema(req.body);
        if (errors && errors.length > 0) {
          throw new BadRequestException('Request validation failed', 'VALIDATION_ERROR', errors);
        }
      } else {
        const result = this.schema.safeParse(req.body);
        if (!result.success) {
          const formattedErrors = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
          throw new BadRequestException('Request payload validation failed', 'VALIDATION_ERROR', formattedErrors);
        }
      }
    }
    return await next();
  }
}
