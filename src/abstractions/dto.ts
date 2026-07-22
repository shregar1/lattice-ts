export interface IDTO {
  // Base interface for all Data Transfer Objects
}

export abstract class BaseDTO implements IDTO {
  // Common DTO logic
}

export interface IModuleDTO extends IDTO {
  // Base interface for module DTOs
}

export abstract class ModuleBaseDTO extends BaseDTO implements IModuleDTO {
  // Base class for module DTOs
}
