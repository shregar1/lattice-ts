export interface IModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseModel implements IModel {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}
