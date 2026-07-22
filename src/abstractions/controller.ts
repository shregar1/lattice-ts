import { IHttpRequest, IHttpResponse, IRequestContext } from '../utilities/http';
import { BaseResponseEnvelopeDTO } from '../dto/controller/responses/base_envelope';
import { ApiStatusConstant } from '../constants/api_status';
import { MessageConstant } from '../constants/message';
import { ResponseKeyConstant } from '../constants/response_key';
import { HttpStatusConstant } from '../constants/http_status';
import { ILogger, StructuredLogger } from '../utilities/logger';
import { MeasurePerformance } from '../utilities/performance_decorator';

export interface IHasLogger {
  readonly logger: ILogger;
}

export interface IController extends IHasLogger {
  // Base interface for all controllers
}

export abstract class BaseController implements IController {
  public readonly logger: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  @MeasurePerformance('controller')
  protected envelope<T>(
    data: T,
    message: string = MessageConstant.OPERATION_COMPLETED_SUCCESSFULLY,
    responseKey: string = ResponseKeyConstant.SUCCESS,
    statusCode: number = HttpStatusConstant.OK,
    context?: IRequestContext
  ): IHttpResponse<BaseResponseEnvelopeDTO<T>> {
    const envelopeDto = new BaseResponseEnvelopeDTO<T>({
      transactionUrn: context?.requestUrn || '',
      status: ApiStatusConstant.SUCCESS,
      responseMessage: message,
      responseKey,
      errors: [],
      timestamp: new Date().toISOString(),
      metadata: {},
      data,
      referenceUrn: context?.referenceUrn || '',
    });

    return {
      statusCode,
      success: true,
      message,
      data: envelopeDto,
    };
  }

  protected success<T>(
    data: T,
    message: string = MessageConstant.OPERATION_COMPLETED_SUCCESSFULLY,
    responseKey: string = ResponseKeyConstant.SUCCESS,
    context?: IRequestContext
  ): IHttpResponse<BaseResponseEnvelopeDTO<T>> {
    return this.envelope(data, message, responseKey, HttpStatusConstant.OK, context);
  }

  protected created<T>(
    data: T,
    message: string = MessageConstant.USER_REGISTERED_SUCCESSFULLY,
    responseKey: string = ResponseKeyConstant.RESOURCE_CREATED,
    context?: IRequestContext
  ): IHttpResponse<BaseResponseEnvelopeDTO<T>> {
    return this.envelope(data, message, responseKey, HttpStatusConstant.CREATED, context);
  }
}
