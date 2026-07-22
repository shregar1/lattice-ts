import { ModuleBaseDTO } from '../abstraction';

export class AppConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly name: string,
    public readonly env: string,
    public readonly port: number,
    public readonly apiVersion: string
  ) {
    super();
  }
}

export class DatabaseConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly host: string,
    public readonly port: number,
    public readonly name: string,
    public readonly user: string,
    public readonly pass: string,
    public readonly poolSize: number
  ) {
    super();
  }
}

export class AuthConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly jwtSecret: string,
    public readonly jwtExpiration: number,
    public readonly saltRounds: number
  ) {
    super();
  }
}

export class LoggingConfigDTO extends ModuleBaseDTO {
  constructor(public readonly level: string) {
    super();
  }
}

export class CacheConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly provider: string,
    public readonly host: string,
    public readonly port: number,
    public readonly defaultTtl: number
  ) {
    super();
  }
}

export class StorageConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly provider: string,
    public readonly bucket: string,
    public readonly basePath: string
  ) {
    super();
  }
}

export class EmailConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly host: string,
    public readonly port: number,
    public readonly from: string
  ) {
    super();
  }
}

export class RateLimitConfigDTO extends ModuleBaseDTO {
  constructor(
    public readonly windowMs: number,
    public readonly max: number
  ) {
    super();
  }
}
