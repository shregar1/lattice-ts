import { IAuthenticationService } from './interfaces/authentication';

export class AuthenticationService implements IAuthenticationService {
  public async hashPassword(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return hash === `hashed_${password}`;
  }
}
