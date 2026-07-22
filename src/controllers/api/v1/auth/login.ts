import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { IAuthenticationOrchestrator } from '../../../../services/orchestrators/interfaces/authentication';
import { LoginRequestDTO } from '../../../../dto/controller/requests/auth';
import { ModuleBaseController } from '../../../abstraction';
import { BaseResponseEnvelopeDTO } from '../../../../dto/controller/responses/base_envelope';
import { MessageConstant } from '../../../../constants/message';
import { ResponseKeyConstant } from '../../../../constants/response_key';

export class LoginController extends ModuleBaseController {
  constructor(private readonly authOrchestrator: IAuthenticationOrchestrator) {
    super();
  }

  public async handle(req: IHttpRequest<LoginRequestDTO>): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    const result = await this.authOrchestrator.login(req.body);
    return this.success(result, MessageConstant.USER_AUTHENTICATED_SUCCESSFULLY, ResponseKeyConstant.AUTHENTICATION_SUCCESS, req.context);
  }
}
