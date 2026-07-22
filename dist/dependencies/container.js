"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DI_TOKENS = exports.Container = void 0;
class Container {
    services = new Map();
    factories = new Map();
    singletons = new Map();
    register(token, instance) {
        this.services.set(token, instance);
    }
    registerFactory(token, factory) {
        this.factories.set(token, factory);
    }
    registerSingleton(token, factory) {
        this.factories.set(token, () => {
            if (!this.singletons.has(token)) {
                this.singletons.set(token, factory());
            }
            return this.singletons.get(token);
        });
    }
    resolve(token) {
        if (this.services.has(token)) {
            return this.services.get(token);
        }
        if (this.factories.has(token)) {
            const factory = this.factories.get(token);
            return factory();
        }
        throw new Error(`Dependency not registered for token: ${String(token)}`);
    }
}
exports.Container = Container;
exports.DI_TOKENS = {
    // Infrastructure & Configuration
    AppConfig: Symbol.for('IAppConfig'),
    Logger: Symbol.for('ILogger'),
    DatabaseSession: Symbol.for('IDatabaseSession'),
    UnitOfWork: Symbol.for('IUnitOfWork'),
    // Clients & Cache
    CacheClient: Symbol.for('ICacheClient'),
    StorageClient: Symbol.for('IStorageClient'),
    HttpClient: Symbol.for('IHttpClient'),
    // System Utilities
    ClockService: Symbol.for('IClockService'),
    UuidService: Symbol.for('IUuidService'),
    // Repositories
    UserRepository: Symbol.for('IUserRepository'),
    // Services
    UserService: Symbol.for('IUserService'),
    AuthenticationService: Symbol.for('IAuthenticationService'),
    JwtService: Symbol.for('IJwtService'),
    // Orchestrators
    AuthenticationOrchestrator: Symbol.for('IAuthenticationOrchestrator'),
    // Controllers
    RegisterController: Symbol.for('RegisterController'),
    LoginController: Symbol.for('LoginController'),
};
