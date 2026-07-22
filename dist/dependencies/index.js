"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyProviderManager = void 0;
exports.setupDependencies = setupDependencies;
const container_1 = require("./container");
const config_provider_1 = require("../configuration/config.provider");
const logger_1 = require("../utilities/logger");
const cache_1 = require("../utilities/cache");
const storage_1 = require("../utilities/storage");
const http_1 = require("../utilities/http");
const system_services_1 = require("../utilities/system_services");
const user_1 = require("../repositories/user");
const user_2 = require("../services/user");
const authentication_1 = require("../services/authentication");
const jwt_1 = require("../utilities/jwt");
const authentication_2 = require("../services/orchestrators/authentication");
const register_1 = require("../controllers/api/v1/auth/register");
const login_1 = require("../controllers/api/v1/auth/login");
class DependencyProviderManager {
    static registerAll(container) {
        // 1. Configuration & Logging (Using ConfigurationProvider Singleton)
        const configProvider = config_provider_1.ConfigurationProvider.getInstance();
        container.register(container_1.DI_TOKENS.AppConfig, configProvider);
        const appConfig = configProvider.getAppConfig();
        const logger = new logger_1.StructuredLogger(appConfig.name);
        container.register(container_1.DI_TOKENS.Logger, logger);
        // 2. Clients & System Utilities
        container.registerSingleton(container_1.DI_TOKENS.CacheClient, () => new cache_1.InMemoryCacheClient());
        container.registerSingleton(container_1.DI_TOKENS.StorageClient, () => new storage_1.LocalStorageClient());
        container.registerSingleton(container_1.DI_TOKENS.HttpClient, () => new http_1.GenericHttpClient());
        container.registerSingleton(container_1.DI_TOKENS.ClockService, () => new system_services_1.SystemClockService());
        container.registerSingleton(container_1.DI_TOKENS.UuidService, () => new system_services_1.UuidService());
        // 3. Database & Unit of Work (Per-request UoW Factory)
        const mockDbModel = {
            findById: async () => null,
            findOne: async () => null,
            find: async () => [],
            create: async (data) => ({ id: 'usr_123', ...data }),
            createMany: async (dataList) => dataList.map((d, i) => ({ id: `usr_${i}`, ...d })),
            update: async (id, data) => ({ id, ...data }),
            updateMany: async () => 1,
            delete: async () => true,
            deleteMany: async () => 1,
            count: async () => 0,
        };
        container.registerFactory(container_1.DI_TOKENS.UnitOfWork, () => ({
            beginTransaction: async () => { },
            commit: async () => { },
            rollback: async () => { },
            executeInTransaction: async (work) => await work(),
        }));
        // 4. Repositories
        container.registerFactory(container_1.DI_TOKENS.UserRepository, () => new user_1.UserRepository(mockDbModel));
        // 5. Services & Jwt Utility
        container.registerFactory(container_1.DI_TOKENS.UserService, () => new user_2.UserService(container.resolve(container_1.DI_TOKENS.UserRepository)));
        container.registerFactory(container_1.DI_TOKENS.AuthenticationService, () => new authentication_1.AuthenticationService());
        container.registerFactory(container_1.DI_TOKENS.JwtService, () => new jwt_1.JwtUtility());
        // 6. Orchestrators
        container.registerFactory(container_1.DI_TOKENS.AuthenticationOrchestrator, () => new authentication_2.AuthenticationOrchestrator(container.resolve(container_1.DI_TOKENS.UserService), container.resolve(container_1.DI_TOKENS.AuthenticationService), container.resolve(container_1.DI_TOKENS.JwtService), container.resolve(container_1.DI_TOKENS.UnitOfWork)));
        // 7. Controllers
        container.registerFactory(container_1.DI_TOKENS.RegisterController, () => new register_1.RegisterController(container.resolve(container_1.DI_TOKENS.AuthenticationOrchestrator)));
        container.registerFactory(container_1.DI_TOKENS.LoginController, () => new login_1.LoginController(container.resolve(container_1.DI_TOKENS.AuthenticationOrchestrator)));
    }
}
exports.DependencyProviderManager = DependencyProviderManager;
function setupDependencies() {
    const container = new container_1.Container();
    DependencyProviderManager.registerAll(container);
    return container;
}
