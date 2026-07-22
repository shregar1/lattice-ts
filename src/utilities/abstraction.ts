import { BaseUtility } from '../abstractions/utility';

export interface IModuleUtility {
  // Base interface for utilities
}

export abstract class ModuleBaseUtility extends BaseUtility implements IModuleUtility {
  // Module-level base utility logic
}
