import { BaseModel } from '../abstractions/model';

export interface IUserModel {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel extends BaseModel implements IUserModel {
  public id: string;
  public email: string;
  public passwordHash: string;
  public firstName: string;
  public lastName: string;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: IUserModel) {
    super();
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.isActive = data.isActive ?? true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
