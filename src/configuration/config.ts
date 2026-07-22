export interface IAppConfig {
  app: {
    name: string;
    env: string;
    port: number;
    apiVersion: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    pass: string;
    poolSize: number;
  };
  auth: {
    jwtSecret: string;
    jwtExpiration: number;
    saltRounds: number;
  };
  logging: {
    level: string;
  };
  cache: {
    provider: 'memory' | 'redis';
    host: string;
    port: number;
    defaultTtl: number;
  };
  storage: {
    provider: 'local' | 's3' | 'gcs' | 'azure';
    bucket: string;
    basePath: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  email: {
    host: string;
    port: number;
    from: string;
  };
}
