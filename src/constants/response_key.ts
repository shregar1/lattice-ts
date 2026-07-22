import { ModuleBaseConstant } from './abstraction';

export class ResponseKeyConstant extends ModuleBaseConstant {
  public static readonly SUCCESS = 'SUCCESS';
  public static readonly RESOURCE_CREATED = 'RESOURCE_CREATED';
  public static readonly USER_REGISTERED = 'USER_REGISTERED';
  public static readonly AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
  public static readonly VALIDATION_ERROR = 'VALIDATION_ERROR';
  public static readonly UNAUTHORIZED = 'UNAUTHORIZED';
  public static readonly FORBIDDEN = 'FORBIDDEN';
  public static readonly NOT_FOUND = 'NOT_FOUND';
  public static readonly CONFLICT = 'CONFLICT';
  public static readonly INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
}
