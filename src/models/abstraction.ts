import { IModel, BaseModel } from '../abstractions/model';

export interface IModuleModel extends IModel {
  // Base interface for all models in the models module
}

export abstract class ModuleBaseModel extends BaseModel implements IModuleModel {
  // Module-level base model logic
}
