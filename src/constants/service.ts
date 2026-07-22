import { ModuleBaseConstant } from './abstraction';

export class ServicesConstant extends ModuleBaseConstant {
  public static readonly AUTHENTICATION_SERVICE = 'AuthenticationService';
  public static readonly AUTHORIZATION_SERVICE = 'AuthorizationService';
  public static readonly USER_SERVICE = 'UserService';
  public static readonly FILE_SERVICE = 'FileService';
  public static readonly EMAIL_SERVICE = 'EmailService';
  public static readonly CACHE_SERVICE = 'CacheService';
  public static readonly NOTIFICATION_SERVICE = 'NotificationService';
  public static readonly AUDIT_SERVICE = 'AuditService';
  public static readonly ENCRYPTION_SERVICE = 'EncryptionService';
  public static readonly JWT_SERVICE = 'JwtService';
  public static readonly UUID_SERVICE = 'UuidService';
}
