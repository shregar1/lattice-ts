import { ModuleBaseConstant } from './abstraction';

export class HttpHeaderConstant extends ModuleBaseConstant {
  public static readonly X_REQUEST_ID = 'x-request-id';
  public static readonly X_CORRELATION_ID = 'x-correlation-id';
  public static readonly X_TENANT_ID = 'x-tenant-id';
  public static readonly AUTHORIZATION = 'authorization';
  public static readonly CONTENT_TYPE = 'content-type';
}
