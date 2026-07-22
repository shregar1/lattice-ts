"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationFactory = void 0;
const abstraction_1 = require("./abstraction");
const config_provider_1 = require("../configuration/config.provider");
class ConfigurationFactory extends abstraction_1.ModuleBaseFactory {
    create(type) {
        const provider = config_provider_1.ConfigurationProvider.getInstance();
        switch (type) {
            case 'app':
                return provider.getAppConfig();
            case 'database':
                return provider.getDatabaseConfig();
            case 'auth':
                return provider.getAuthConfig();
            case 'logging':
                return provider.getLoggingConfig();
            case 'cache':
                return provider.getCacheConfig();
            case 'storage':
                return provider.getStorageConfig();
            case 'email':
                return provider.getEmailConfig();
            default:
                return provider;
        }
    }
    getAppConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getAppConfig();
    }
    getDatabaseConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getDatabaseConfig();
    }
    getAuthConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getAuthConfig();
    }
    getLoggingConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getLoggingConfig();
    }
    getCacheConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getCacheConfig();
    }
    getStorageConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getStorageConfig();
    }
    getEmailConfig() {
        return config_provider_1.ConfigurationProvider.getInstance().getEmailConfig();
    }
}
exports.ConfigurationFactory = ConfigurationFactory;
