import { BaseController } from '../../../../abstractions/controller';
import { RegisterRequestDTO } from '../../../../dto/controller/requests/auth';
import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { AuthenticationOrchestrator } from '../../../../services/orchestrators/authentication';
import { MessageConstant } from '../../../../constants/message';

export class RegisterController extends BaseController {
  constructor(private readonly authOrchestrator: AuthenticationOrchestrator) {
    super();
  }

  public async handle(req: IHttpRequest<RegisterRequestDTO>): Promise<IHttpResponse> {
    const { email, password, firstName, lastName } = req.body;

    const result = await this.authOrchestrator.register({
      email,
      password,
      firstName,
      lastName,
      context: req.context,
    });

    return this.created(result, MessageConstant.USER_REGISTERED_SUCCESSFULLY, 'USER_REGISTERED', req.context);
  }
}
