export class Container {
  private services = new Map<string | symbol, any>();
  private factories = new Map<string | symbol, () => any>();
  private singletons = new Map<string | symbol, any>();

  public register<T>(token: string | symbol, instance: T): void {
    this.services.set(token, instance);
  }

  public registerFactory<T>(token: string | symbol, factory: () => T): void {
    this.factories.set(token, factory);
  }

  public registerSingleton<T>(token: string | symbol, factory: () => T): void {
    this.factories.set(token, () => {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, factory());
      }
      return this.singletons.get(token);
    });
  }

  public resolve<T>(token: string | symbol): T {
    if (this.services.has(token)) {
      return this.services.get(token);
    }
    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!;
      return factory();
    }
    throw new Error(`Dependency not registered for token: ${String(token)}`);
  }
}

export const DI_TOKENS = {
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
