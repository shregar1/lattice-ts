import { IExecutionMetrics } from './performance_decorator';

export interface IRequestContext {
  requestUrn: string;
  referenceUrn: string;
  correlationId: string;
  startTime: number;
  clientIp: string;
  userAgent: string;
  path: string;
  method: string;
  userId?: string;
  tenantId?: string;
  roles?: string[];
  permissions?: string[];
  metrics?: IExecutionMetrics[];
}

export interface IHttpRequest<TBody = any, TParams = any, TQuery = any, THeaders = any> {
  body: TBody;
  params: TParams;
  query: TQuery;
  headers: THeaders;
  context?: IRequestContext;
  responseHeaders?: Record<string, string>;
  isAuditable?: boolean;
  auditAction?: string;
}

export interface IHttpResponse<TData = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: TData;
  errors?: any[];
  meta?: Record<string, any>;
}

export interface IHttpRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeoutMs?: number;
}

export interface IHttpClient {
  get<T>(url: string, options?: IHttpRequestOptions): Promise<T>;
  post<T>(url: string, body: any, options?: IHttpRequestOptions): Promise<T>;
  put<T>(url: string, body: any, options?: IHttpRequestOptions): Promise<T>;
  delete<T>(url: string, options?: IHttpRequestOptions): Promise<T>;
}

export class GenericHttpClient implements IHttpClient {
  public async get<T>(url: string, options?: IHttpRequestOptions): Promise<T> {
    return {} as T;
  }

  public async post<T>(url: string, body: any, options?: IHttpRequestOptions): Promise<T> {
    return {} as T;
  }

  public async put<T>(url: string, body: any, options?: IHttpRequestOptions): Promise<T> {
    return {} as T;
  }

  public async delete<T>(url: string, options?: IHttpRequestOptions): Promise<T> {
    return {} as T;
  }
}
