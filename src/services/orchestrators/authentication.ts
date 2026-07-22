import { BaseOrchestrator } from '../../abstractions/orchestrator';
import { IUserService } from '../interfaces/user';
import { IAuthenticationService } from '../interfaces/authentication';
import { IJwtService } from '../../utilities/jwt';
import { IUnitOfWork } from '../../utilities/unit_of_work';
import { RegisterRequestDTO } from '../../dto/controller/requests/auth';
import { LoginRequestDTO } from '../../dto/controller/requests/auth';
import { ConflictException } from '../../exceptions/conflict';
import { UnauthenticatedException } from '../../exceptions/unauthenticated';
import { MeasurePerformance } from '../../utilities/performance_decorator';

export class AuthenticationOrchestrator extends BaseOrchestrator {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: IAuthenticationService,
    private readonly jwtService: IJwtService,
    unitOfWork: IUnitOfWork
  ) {
    super(unitOfWork);
  }

  @MeasurePerformance('orchestrator')
  public async register(dto: RegisterRequestDTO & { context?: any }): Promise<{ email: string; token: string }> {
    return await this.executeInTransaction(async () => {
      const existingUser = await this.userService.getUserByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException(`User with email '${dto.email}' already exists`);
      }

      const passwordHash = await this.authService.hashPassword(dto.password);

      // Pass context downstream for timing collection
      const createdUser = await (this.userService.createUser as any)({
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      }, dto.context);

      const token = await this.jwtService.generateToken({
        userId: createdUser.id,
        email: createdUser.email,
      });

      return {
        email: createdUser.email,
        token,
      };
    }, 'AuthenticationOrchestrator.register');
  }

  @MeasurePerformance('orchestrator')
  public async login(dto: LoginRequestDTO): Promise<{ email: string; token: string }> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthenticatedException('Invalid email or password');
    }

    const isValidPassword = await this.authService.verifyPassword(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthenticatedException('Invalid email or password');
    }

    const token = await this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      email: user.email,
      token,
    };
  }
}
