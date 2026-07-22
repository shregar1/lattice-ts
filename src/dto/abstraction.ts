import { IDTO, BaseDTO } from '../abstractions/dto';

export interface IModuleDTO extends IDTO {
  // Base interface for all DTOs in the DTO module
}

export abstract class ModuleBaseDTO extends BaseDTO implements IModuleDTO {
  // Module-level base DTO logic
}
