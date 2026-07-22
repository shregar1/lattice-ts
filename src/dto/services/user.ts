import { ModuleBaseDTO } from '../../abstractions/dto';

export class UserServiceDTO extends ModuleBaseDTO {
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
