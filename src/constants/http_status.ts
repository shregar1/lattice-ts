import { BaseConstant } from './abstraction';

export class HttpStatusConstant extends BaseConstant {
  public static readonly OK = 200;
  public static readonly CREATED = 201;
  public static readonly ACCEPTED = 202;
  public static readonly NO_CONTENT = 204;
  public static readonly BAD_REQUEST = 400;
  public static readonly UNAUTHORIZED = 401;
  public static readonly FORBIDDEN = 403;
  public static readonly NOT_FOUND = 404;
  public static readonly CONFLICT = 409;
  public static readonly UNPROCESSABLE_ENTITY = 422;
  public static readonly TOO_MANY_REQUESTS = 429;
  public static readonly INTERNAL_SERVER_ERROR = 500;
  public static readonly SERVICE_UNAVAILABLE = 503;
  public static readonly GATEWAY_TIMEOUT = 504;
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}
