import { BaseRepository, IBaseRepository, IQueryCriteria } from './abstraction';
import { IUserModel } from '../models/user';

export interface IUserRepository extends IBaseRepository<IUserModel, string> {
  findByEmail(email: string): Promise<IUserModel | null>;
}

export class UserRepository extends BaseRepository<any, IUserModel, string> implements IUserRepository {
  constructor(dbModel: any) {
    super(dbModel);
  }

  public async findByEmail(email: string): Promise<IUserModel | null> {
    this.logger.info(`Fetching user record by email '${email}'`);
    const criteria: IQueryCriteria = {
      conditions: [{ field: 'email', operator: 'eq', value: email }],
    };
    return await this.findOne(criteria);
  }

  protected override mapToEntity(model: any): IUserModel {
    return {
      id: model.id,
      email: model.email,
      passwordHash: model.password_hash || model.passwordHash,
      firstName: model.first_name || model.firstName,
      lastName: model.last_name || model.lastName,
      isActive: model.is_active ?? true,
      createdAt: model.created_at || new Date(),
      updatedAt: model.updated_at || new Date(),
    };
  }

  protected override mapToModel(entity: Partial<IUserModel>): any {
    return {
      id: entity.id,
      email: entity.email,
      password_hash: entity.passwordHash,
      first_name: entity.firstName,
      last_name: entity.lastName,
      is_active: entity.isActive,
    };
  }
}
