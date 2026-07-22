"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitConfigDTO = exports.EmailConfigDTO = exports.StorageConfigDTO = exports.CacheConfigDTO = exports.LoggingConfigDTO = exports.AuthConfigDTO = exports.DatabaseConfigDTO = exports.AppConfigDTO = void 0;
const abstraction_1 = require("../abstraction");
class AppConfigDTO extends abstraction_1.ModuleBaseDTO {
    name;
    env;
    port;
    apiVersion;
    constructor(name, env, port, apiVersion) {
        super();
        this.name = name;
        this.env = env;
        this.port = port;
        this.apiVersion = apiVersion;
    }
}
exports.AppConfigDTO = AppConfigDTO;
class DatabaseConfigDTO extends abstraction_1.ModuleBaseDTO {
    host;
    port;
    name;
    user;
    pass;
    poolSize;
    constructor(host, port, name, user, pass, poolSize) {
        super();
        this.host = host;
        this.port = port;
        this.name = name;
        this.user = user;
        this.pass = pass;
        this.poolSize = poolSize;
    }
}
exports.DatabaseConfigDTO = DatabaseConfigDTO;
class AuthConfigDTO extends abstraction_1.ModuleBaseDTO {
    jwtSecret;
    jwtExpiration;
    saltRounds;
    constructor(jwtSecret, jwtExpiration, saltRounds) {
        super();
        this.jwtSecret = jwtSecret;
        this.jwtExpiration = jwtExpiration;
        this.saltRounds = saltRounds;
    }
}
exports.AuthConfigDTO = AuthConfigDTO;
class LoggingConfigDTO extends abstraction_1.ModuleBaseDTO {
    level;
    constructor(level) {
        super();
        this.level = level;
    }
}
exports.LoggingConfigDTO = LoggingConfigDTO;
class CacheConfigDTO extends abstraction_1.ModuleBaseDTO {
    provider;
    host;
    port;
    defaultTtl;
    constructor(provider, host, port, defaultTtl) {
        super();
        this.provider = provider;
        this.host = host;
        this.port = port;
        this.defaultTtl = defaultTtl;
    }
}
exports.CacheConfigDTO = CacheConfigDTO;
class StorageConfigDTO extends abstraction_1.ModuleBaseDTO {
    provider;
    bucket;
    basePath;
    constructor(provider, bucket, basePath) {
        super();
        this.provider = provider;
        this.bucket = bucket;
        this.basePath = basePath;
    }
}
exports.StorageConfigDTO = StorageConfigDTO;
class EmailConfigDTO extends abstraction_1.ModuleBaseDTO {
    host;
    port;
    from;
    constructor(host, port, from) {
        super();
        this.host = host;
        this.port = port;
        this.from = from;
    }
}
exports.EmailConfigDTO = EmailConfigDTO;
class RateLimitConfigDTO extends abstraction_1.ModuleBaseDTO {
    windowMs;
    max;
    constructor(windowMs, max) {
        super();
        this.windowMs = windowMs;
        this.max = max;
    }
}
exports.RateLimitConfigDTO = RateLimitConfigDTO;
