import { z } from 'zod';
import { ModuleBaseDTO } from '../../abstraction';

export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export class RegisterRequestDTO extends ModuleBaseDTO {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {
    super();
  }
}

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export class LoginRequestDTO extends ModuleBaseDTO {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {
    super();
  }
}
