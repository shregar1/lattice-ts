import { Container, DI_TOKENS } from './container';
import { ConfigurationProvider } from '../configuration/config.provider';
import { StructuredLogger } from '../utilities/logger';
import { InMemoryCacheClient } from '../utilities/cache';
import { LocalStorageClient } from '../utilities/storage';
import { GenericHttpClient } from '../utilities/http';
import { SystemClockService, UuidService } from '../utilities/system_services';
import { UserRepository } from '../repositories/user';
import { UserService } from '../services/user';
import { AuthenticationService } from '../services/authentication';
import { JwtUtility } from '../utilities/jwt';
import { AuthenticationOrchestrator } from '../services/orchestrators/authentication';
import { RegisterController } from '../controllers/api/v1/auth/register';
import { LoginController } from '../controllers/api/v1/auth/login';
import { IUnitOfWork } from '../utilities/unit_of_work';

export class DependencyProviderManager {
  public static registerAll(container: Container): void {
    // 1. Configuration & Logging (Using ConfigurationProvider Singleton)
    const configProvider = ConfigurationProvider.getInstance();
    container.register(DI_TOKENS.AppConfig, configProvider);

    const appConfig = configProvider.getAppConfig();
    const logger = new StructuredLogger(appConfig.name);
    container.register(DI_TOKENS.Logger, logger);

    // 2. Clients & System Utilities
    container.registerSingleton(DI_TOKENS.CacheClient, () => new InMemoryCacheClient());
    container.registerSingleton(DI_TOKENS.StorageClient, () => new LocalStorageClient());
    container.registerSingleton(DI_TOKENS.HttpClient, () => new GenericHttpClient());
    container.registerSingleton(DI_TOKENS.ClockService, () => new SystemClockService());
    container.registerSingleton(DI_TOKENS.UuidService, () => new UuidService());

    // 3. Database & Unit of Work (Per-request UoW Factory)
    const mockDbModel = {
      findById: async () => null,
      findOne: async () => null,
      find: async () => [],
      create: async (data: any) => ({ id: 'usr_123', ...data }),
      createMany: async (dataList: any[]) => dataList.map((d, i) => ({ id: `usr_${i}`, ...d })),
      update: async (id: string, data: any) => ({ id, ...data }),
      updateMany: async () => 1,
      delete: async () => true,
      deleteMany: async () => 1,
      count: async () => 0,
    };

    container.registerFactory<IUnitOfWork>(DI_TOKENS.UnitOfWork, () => ({
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      executeInTransaction: async <T>(work: () => Promise<T>): Promise<T> => await work(),
    }));

    // 4. Repositories
    container.registerFactory(DI_TOKENS.UserRepository, () => new UserRepository(mockDbModel));

    // 5. Services & Jwt Utility
    container.registerFactory(
      DI_TOKENS.UserService,
      () => new UserService(container.resolve(DI_TOKENS.UserRepository))
    );
    container.registerFactory(DI_TOKENS.AuthenticationService, () => new AuthenticationService());
    container.registerFactory(DI_TOKENS.JwtService, () => new JwtUtility());

    // 6. Orchestrators
    container.registerFactory(
      DI_TOKENS.AuthenticationOrchestrator,
      () =>
        new AuthenticationOrchestrator(
          container.resolve(DI_TOKENS.UserService),
          container.resolve(DI_TOKENS.AuthenticationService),
          container.resolve(DI_TOKENS.JwtService),
          container.resolve(DI_TOKENS.UnitOfWork)
        )
    );

    // 7. Controllers
    container.registerFactory(
      DI_TOKENS.RegisterController,
      () => new RegisterController(container.resolve(DI_TOKENS.AuthenticationOrchestrator))
    );
    container.registerFactory(
      DI_TOKENS.LoginController,
      () => new LoginController(container.resolve(DI_TOKENS.AuthenticationOrchestrator))
    );
  }
}

export function setupDependencies(): Container {
  const container = new Container();
  DependencyProviderManager.registerAll(container);
  return container;
}
