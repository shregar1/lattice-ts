import { ModuleBaseDTO } from '../../abstraction';

export class BaseResponseEnvelopeDTO<TData = any> extends ModuleBaseDTO {
  public readonly transactionUrn: string;
  public readonly status: string;
  public readonly responseMessage: string;
  public readonly responseKey: string;
  public readonly errors: any[];
  public readonly timestamp: string;
  public readonly metadata: Record<string, any>;
  public readonly data: TData;
  public readonly referenceUrn: string;

  constructor(params: {
    transactionUrn?: string;
    status?: string;
    responseMessage?: string;
    responseKey?: string;
    errors?: any[];
    timestamp?: string;
    metadata?: Record<string, any>;
    data?: TData;
    referenceUrn?: string;
  }) {
    super();
    this.transactionUrn = params.transactionUrn || '';
    this.status = params.status || 'SUCCESS';
    this.responseMessage = params.responseMessage || 'Operation completed successfully';
    this.responseKey = params.responseKey || 'SUCCESS';
    this.errors = params.errors || [];
    this.timestamp = params.timestamp || new Date().toISOString();
    this.metadata = params.metadata || {};
    this.data = params.data !== undefined ? params.data : ({} as TData);
    this.referenceUrn = params.referenceUrn || '';
  }

  public static success<T>(data: T, message: string = 'Success', responseKey: string = 'SUCCESS'): BaseResponseEnvelopeDTO<T> {
    return new BaseResponseEnvelopeDTO<T>({
      status: 'SUCCESS',
      responseMessage: message,
      responseKey,
      data,
    });
  }

  public static error(message: string, responseKey: string = 'INTERNAL_SERVER_ERROR', errors: any[] = []): BaseResponseEnvelopeDTO<null> {
    return new BaseResponseEnvelopeDTO<null>({
      status: 'FAILED',
      responseMessage: message,
      responseKey,
      errors,
      data: null,
    });
  }
}
