import { IUserService } from './interfaces/user';
import { IUserRepository } from '../repositories/user';
import { UserServiceDTO } from '../dto/services/user';
import { NotFoundException } from '../exceptions/not_found';
import { BaseService } from '../abstractions/service';
import { MeasurePerformance } from '../utilities/performance_decorator';

export class UserService extends BaseService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  @MeasurePerformance('service')
  public async getUserById(id: string): Promise<UserServiceDTO> {
    this.logger.info(`Fetching user by ID ${id}`);
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserServiceDTO(user.id, user.email, user.firstName, user.lastName, user.isActive);
  }

  @MeasurePerformance('service')
  public async getUserByEmail(email: string): Promise<(UserServiceDTO & { passwordHash: string }) | null> {
    this.logger.info(`Fetching user by email ${email}`);
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    const dto: any = new UserServiceDTO(user.id, user.email, user.firstName, user.lastName, user.isActive);
    dto.passwordHash = user.passwordHash;
    return dto;
  }

  @MeasurePerformance('service')
  public async createUser(userData: { email: string; passwordHash: string; firstName: string; lastName: string }): Promise<UserServiceDTO> {
    this.logger.info(`Creating new user account for ${userData.email}`);
    const user = await this.userRepository.create(userData);
    return new UserServiceDTO(user.id, user.email, user.firstName, user.lastName, user.isActive);
  }
}
