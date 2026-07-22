import { ModuleBaseDTO } from '../../abstraction';

export class AuthResponseDTO extends ModuleBaseDTO {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly token: string
  ) {
    super();
  }
}

export class UserResponseDTO extends ModuleBaseDTO {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly isActive: boolean
  ) {
    super();
  }
}
