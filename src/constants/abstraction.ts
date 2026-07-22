import { IConstant, BaseConstant } from '../abstractions/constant';

export { BaseConstant };

export interface IModuleConstant extends IConstant {
  // Base interface for all module-level constants
}

export abstract class ModuleBaseConstant extends BaseConstant implements IModuleConstant {
  // Module-level constant logic
}
