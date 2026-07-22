import { ModuleBaseUtility } from './abstraction';

export interface IJwtService {
  generateToken(payload: Record<string, any>, secret?: string, expiresIn?: number): Promise<string>;
  verifyToken(token: string, secret?: string): Promise<Record<string, any>>;
}

export class JwtUtility extends ModuleBaseUtility implements IJwtService {
  public async generateToken(payload: Record<string, any>, secret: string = 'default_secret', expiresIn: number = 86400): Promise<string> {
    return `jwt_token_${JSON.stringify(payload)}`;
  }

  public async verifyToken(token: string, secret: string = 'default_secret'): Promise<Record<string, any>> {
    if (!token.startsWith('jwt_token_')) {
      throw new Error('Invalid JWT Token format');
    }
    const jsonStr = token.substring(10);
    return JSON.parse(jsonStr);
  }
}
