import { ModuleBaseConstant } from './abstraction';

export class MessageConstant extends ModuleBaseConstant {
  public static readonly USER_REGISTERED_SUCCESSFULLY = 'User registered successfully';
  public static readonly USER_AUTHENTICATED_SUCCESSFULLY = 'User authenticated successfully';
  public static readonly OPERATION_COMPLETED_SUCCESSFULLY = 'Operation completed successfully';
  public static readonly SERVICE_IS_HEALTHY = 'Service is healthy';
  public static readonly INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password';
  public static readonly USER_ALREADY_EXISTS = 'User with this email already exists';
  public static readonly RESOURCE_NOT_FOUND = 'Resource not found';
  public static readonly INTERNAL_SERVER_ERROR = 'Internal server error';
}
