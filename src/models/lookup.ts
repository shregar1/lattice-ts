import { BaseModel } from '../abstractions/model';

export interface ILookupModel {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export class LookupModel extends BaseModel implements ILookupModel {
  public id: string;
  public code: string;
  public name: string;
  public description?: string;
  public isActive: boolean;

  constructor(data: ILookupModel) {
    super();
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.description = data.description;
    this.isActive = data.isActive ?? true;
  }
}

export interface IRoleModel extends ILookupModel {}

export class RoleModel extends LookupModel implements IRoleModel {}
