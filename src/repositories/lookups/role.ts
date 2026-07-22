import { GenericLookupRepository } from './abstraction';
import { IRoleModel } from '../../models/lookup';
import { ICacheClient } from '../../utilities/cache';

export class RoleRepository extends GenericLookupRepository<IRoleModel> {
  constructor(dbModel: any, cacheClient: ICacheClient) {
    super(dbModel, cacheClient, 'Role');
  }
}
