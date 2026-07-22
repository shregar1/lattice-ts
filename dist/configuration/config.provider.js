"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationProvider = void 0;
const configuration_1 = require("../abstractions/configuration");
const config_dtos_1 = require("../dto/configurations/config_dtos");
const config_json_1 = __importDefault(require("./app/config.json"));
const config_json_2 = __importDefault(require("./db/config.json"));
const config_json_3 = __importDefault(require("./cache/config.json"));
const config_json_4 = __importDefault(require("./auth/config.json"));
const config_json_5 = __importDefault(require("./logging/config.json"));
const config_json_6 = __importDefault(require("./storage/config.json"));
const config_json_7 = __importDefault(require("./email/config.json"));
class ConfigurationProvider extends configuration_1.BaseConfiguration {
    static instance = null;
    appConfig;
    databaseConfig;
    authConfig;
    loggingConfig;
    cacheConfig;
    storageConfig;
    emailConfig;
    rateLimitConfig;
    constructor() {
        super();
        const env = process.env.NODE_ENV || config_json_1.default.env;
        this.appConfig = new config_dtos_1.AppConfigDTO(process.env.APP_NAME || config_json_1.default.name, env, parseInt(process.env.PORT || String(config_json_1.default.port), 10), process.env.API_VERSION || config_json_1.default.apiVersion);
        this.databaseConfig = new config_dtos_1.DatabaseConfigDTO(process.env.DB_HOST || config_json_2.default.host, parseInt(process.env.DB_PORT || String(config_json_2.default.port), 10), process.env.DB_NAME || config_json_2.default.name, process.env.DB_USER || config_json_2.default.user, process.env.DB_PASSWORD || config_json_2.default.pass, parseInt(process.env.DB_POOL_SIZE || String(config_json_2.default.poolSize), 10));
        this.authConfig = new config_dtos_1.AuthConfigDTO(process.env.JWT_SECRET || config_json_4.default.jwtSecret, parseInt(process.env.JWT_EXPIRATION || String(config_json_4.default.jwtExpiration), 10), config_json_4.default.saltRounds);
        this.loggingConfig = new config_dtos_1.LoggingConfigDTO(process.env.LOG_LEVEL || config_json_5.default.level);
        this.cacheConfig = new config_dtos_1.CacheConfigDTO(process.env.CACHE_PROVIDER || config_json_3.default.provider, process.env.REDIS_HOST || config_json_3.default.host, parseInt(process.env.REDIS_PORT || String(config_json_3.default.port), 10), config_json_3.default.defaultTtl);
        this.storageConfig = new config_dtos_1.StorageConfigDTO(process.env.STORAGE_PROVIDER || config_json_6.default.provider, process.env.STORAGE_BUCKET || config_json_6.default.bucket, process.env.STORAGE_BASE_PATH || config_json_6.default.basePath);
        this.emailConfig = new config_dtos_1.EmailConfigDTO(process.env.EMAIL_HOST || config_json_7.default.host, parseInt(process.env.EMAIL_PORT || String(config_json_7.default.port), 10), process.env.EMAIL_FROM || config_json_7.default.from);
        this.rateLimitConfig = new config_dtos_1.RateLimitConfigDTO(15 * 60 * 1000, 100);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ConfigurationProvider();
        }
        return this.instance;
    }
    getAppConfig() {
        return this.appConfig;
    }
    getDatabaseConfig() {
        return this.databaseConfig;
    }
    getAuthConfig() {
        return this.authConfig;
    }
    getLoggingConfig() {
        return this.loggingConfig;
    }
    getCacheConfig() {
        return this.cacheConfig;
    }
    getStorageConfig() {
        return this.storageConfig;
    }
    getEmailConfig() {
        return this.emailConfig;
    }
    getRateLimitConfig() {
        return this.rateLimitConfig;
    }
}
exports.ConfigurationProvider = ConfigurationProvider;
