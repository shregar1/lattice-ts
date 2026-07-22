import { ModuleBaseConstant } from './abstraction';

export class ApiEndpointsConstant extends ModuleBaseConstant {
  public static readonly AUTH_REGISTER = '/api/v1/auth/register';
  public static readonly AUTH_LOGIN = '/api/v1/auth/login';
  public static readonly USER_PROFILE = '/api/v1/user/profile';
  public static readonly FILE_UPLOAD = '/api/v1/file/upload';
  public static readonly HEALTH_CHECK = '/api/v1/health';
}
