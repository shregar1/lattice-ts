import { BaseConstant } from './abstraction';

export class HttpMethodConstant extends BaseConstant {
  public static readonly GET = 'GET';
  public static readonly POST = 'POST';
  public static readonly PUT = 'PUT';
  public static readonly PATCH = 'PATCH';
  public static readonly DELETE = 'DELETE';
  public static readonly OPTIONS = 'OPTIONS';
  public static readonly HEAD = 'HEAD';
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}
