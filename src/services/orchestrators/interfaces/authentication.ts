import { RegisterRequestDTO, LoginRequestDTO } from '../../../dto/controller/requests/auth';
import { AuthResponseDTO } from '../../../dto/controller/responses/auth';

export interface IAuthenticationOrchestrator {
  register(dto: RegisterRequestDTO): Promise<AuthResponseDTO>;
  login(dto: LoginRequestDTO): Promise<AuthResponseDTO>;
}
