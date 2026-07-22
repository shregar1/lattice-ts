import { ModuleBaseFactory } from './abstraction';
import { BaseResponseEnvelopeDTO } from '../dto/controller/responses/base_envelope';
import { IRequestContext } from '../utilities/http';

export class ResponseEnvelopeFactory extends ModuleBaseFactory<BaseResponseEnvelopeDTO> {
  public create(params: {
    status?: string;
    message?: string;
    responseKey?: string;
    data?: any;
    errors?: any[];
    context?: IRequestContext;
  }): BaseResponseEnvelopeDTO {
    return new BaseResponseEnvelopeDTO({
      transactionUrn: params.context?.requestUrn || '',
      status: params.status || 'SUCCESS',
      responseMessage: params.message || 'Operation successful',
      responseKey: params.responseKey || 'SUCCESS',
      errors: params.errors || [],
      timestamp: new Date().toISOString(),
      metadata: {},
      data: params.data,
      referenceUrn: params.context?.referenceUrn || '',
    });
  }

  public createSuccess<T>(data: T, message: string = 'Success', responseKey: string = 'SUCCESS', context?: IRequestContext): BaseResponseEnvelopeDTO<T> {
    return this.create({ status: 'SUCCESS', message, responseKey, data, context });
  }

  public createError(message: string, responseKey: string = 'ERROR', errors: any[] = [], context?: IRequestContext): BaseResponseEnvelopeDTO<null> {
    return this.create({ status: 'FAILED', message, responseKey, errors, data: null, context });
  }
}
