import { UserServiceDTO } from '../../dto/services/user';

export interface IUserService {
  getUserById(id: string): Promise<UserServiceDTO>;
  getUserByEmail(email: string): Promise<(UserServiceDTO & { passwordHash: string }) | null>;
  createUser(userData: { email: string; passwordHash: string; firstName: string; lastName: string }): Promise<UserServiceDTO>;
}
