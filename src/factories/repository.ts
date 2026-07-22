import { BaseFactory } from '../abstractions/factory';
import { UserRepository } from '../repositories/user';
import { IUserRepository } from '../repositories/user';
import { GenericLookupRepository } from '../repositories/lookups/abstraction';
import { ILookupModel } from '../models/lookup';
import { ICacheClient } from '../utilities/cache';

export class RepositoryFactory extends BaseFactory<any> {
  public create(repositoryType: string, dbModel: any, cacheClient?: ICacheClient, entityName?: string): any {
    switch (repositoryType.toLowerCase()) {
      case 'user':
        return new UserRepository(dbModel);
      case 'lookup':
        if (!cacheClient || !entityName) {
          throw new Error('Cache client and entity name are required to create a GenericLookupRepository');
        }
        return new GenericLookupRepository<ILookupModel>(dbModel, cacheClient, entityName);
      default:
        throw new Error(`Unknown repository type '${repositoryType}'`);
    }
  }

  public createUserRepository(dbModel: any): IUserRepository {
    return new UserRepository(dbModel);
  }

  public createLookupRepository<T extends ILookupModel>(
    dbModel: any,
    cacheClient: ICacheClient,
    entityName: string
  ): GenericLookupRepository<T> {
    return new GenericLookupRepository<T>(dbModel, cacheClient, entityName);
  }
}
