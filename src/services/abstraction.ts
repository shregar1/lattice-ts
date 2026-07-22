import { IService, BaseService } from '../abstractions/service';

export interface IModuleService extends IService {
  // Base interface for all services in the services module
}

export abstract class ModuleBaseService extends BaseService implements IModuleService {
  // Module-level base service logic
}
