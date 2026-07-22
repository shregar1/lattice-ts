import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { ModuleBaseController } from '../../../abstraction';
import { BaseResponseEnvelopeDTO } from '../../../../dto/controller/responses/base_envelope';
import { GenericSearchRequestDTO } from '../../../../dto/common/pagination_dto';

export class SearchPlatformController extends ModuleBaseController {
  public async handle(req: IHttpRequest<GenericSearchRequestDTO>): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    const searchResult = {
      items: [],
      total: 0,
      page: req.body?.pagination?.page || 1,
      limit: req.body?.pagination?.limit || 20,
      totalPages: 0,
    };
    return this.success(searchResult, 'Search query executed successfully', 'SEARCH_SUCCESS', req.context);
  }
}
