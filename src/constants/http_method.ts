import { ModuleBaseConstant } from './abstraction';

export class HttpMethodConstant extends ModuleBaseConstant {
  public static readonly GET = 'GET';
  public static readonly POST = 'POST';
  public static readonly PUT = 'PUT';
  public static readonly PATCH = 'PATCH';
  public static readonly DELETE = 'DELETE';
  public static readonly OPTIONS = 'OPTIONS';
  public static readonly HEAD = 'HEAD';
}
