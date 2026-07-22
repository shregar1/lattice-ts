"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesConstant = void 0;
const abstraction_1 = require("./abstraction");
class ServicesConstant extends abstraction_1.ModuleBaseConstant {
    static AUTHENTICATION_SERVICE = 'AuthenticationService';
    static AUTHORIZATION_SERVICE = 'AuthorizationService';
    static USER_SERVICE = 'UserService';
    static FILE_SERVICE = 'FileService';
    static EMAIL_SERVICE = 'EmailService';
    static CACHE_SERVICE = 'CacheService';
    static NOTIFICATION_SERVICE = 'NotificationService';
    static AUDIT_SERVICE = 'AuditService';
    static ENCRYPTION_SERVICE = 'EncryptionService';
    static JWT_SERVICE = 'JwtService';
    static UUID_SERVICE = 'UuidService';
}
exports.ServicesConstant = ServicesConstant;
