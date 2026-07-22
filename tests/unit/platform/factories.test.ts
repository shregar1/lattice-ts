import { ConfigurationFactory } from '../../../src/factories/configuration';
import { RepositoryFactory } from '../../../src/factories/repository';
import { ResponseEnvelopeFactory } from '../../../src/factories/response_envelope';
import { MiddlewareFactory } from '../../../src/factories/middleware';
import { InMemoryCacheClient } from '../../../src/utilities/cache';

describe('Factory Pattern Unit Tests', () => {
  test('ConfigurationFactory should create typed configuration DTOs', () => {
    const factory = new ConfigurationFactory();
    const appConfig = factory.getAppConfig();
    expect(appConfig.name).toBe('BackendServiceScaffold');
    expect(appConfig.env).toBeDefined();

    const dbConfig = factory.create('database');
    expect(dbConfig.host).toBe('localhost');
    expect(dbConfig.port).toBe(5432);
  });

  test('RepositoryFactory should instantiate concrete repositories', () => {
    const factory = new RepositoryFactory();
    const mockModel = {};
    const userRepo = factory.createUserRepository(mockModel);
    expect(userRepo).toBeDefined();

    const cache = new InMemoryCacheClient();
    const lookupRepo = factory.createLookupRepository(mockModel, cache, 'Status');
    expect(lookupRepo).toBeDefined();
  });

  test('ResponseEnvelopeFactory should instantiate standard response envelopes', () => {
    const factory = new ResponseEnvelopeFactory();
    const envelope = factory.createSuccess({ foo: 'bar' }, 'Operation OK');
    expect(envelope.status).toBe('SUCCESS');
    expect(envelope.responseMessage).toBe('Operation OK');
    expect(envelope.data).toEqual({ foo: 'bar' });
  });

  test('MiddlewareFactory should instantiate requested middleware stages', () => {
    const factory = new MiddlewareFactory();
    const hostMiddleware = factory.create('trustedhost', { allowedHosts: ['localhost'] });
    expect(hostMiddleware).toBeDefined();

    const timeoutMiddleware = factory.create('requesttimeout', { timeoutMs: 5000 });
    expect(timeoutMiddleware).toBeDefined();
  });
});
