import { ResponseBuilderMiddleware } from '../../../src/middleware/response_builder';
import { SecurityHeadersMiddleware } from '../../../src/middleware/security_headers';
import { IHttpRequest, IHttpResponse } from '../../../src/utilities/http';

describe('ResponseBuilderMiddleware & SecurityHeadersMiddleware Suite', () => {
  let responseBuilder: ResponseBuilderMiddleware;
  let securityHeaders: SecurityHeadersMiddleware;

  beforeEach(() => {
    responseBuilder = new ResponseBuilderMiddleware();
    securityHeaders = new SecurityHeadersMiddleware();
  });

  test('should attach X-Request-URN, X-Reference-URN, X-RateLimit headers and build envelope', async () => {
    const mockReq = {
      body: {},
      params: {},
      query: {},
      headers: {},
      context: {
        requestUrn: 'urn:request:12345',
        referenceUrn: 'urn:reference:67890',
        correlationId: 'corr-abc-123',
        startTime: Date.now() - 50,
        clientIp: '127.0.0.1',
        userAgent: 'JestTest',
        path: '/api/v1/test',
        method: 'GET',
      },
    } as IHttpRequest;

    const mockNext = async (): Promise<IHttpResponse> => ({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: { userId: 'u-123' },
    });

    const result = await responseBuilder.handle(mockReq, mockNext);

    expect(result.meta?.headers).toBeDefined();
    expect(result.meta?.headers['X-Request-URN']).toBe('urn:request:12345');
    expect(result.meta?.headers['X-Reference-URN']).toBe('urn:reference:67890');
    expect(result.meta?.headers['X-Correlation-ID']).toBe('corr-abc-123');
    expect(result.meta?.headers['X-RateLimit-Limit']).toBe('100');
    expect(result.meta?.headers['X-Response-Time-MS']).toBeDefined();
  });

  test('should strip server disclosure headers (Server, X-Powered-By, X-Runtime)', async () => {
    const mockReq = {
      body: {},
      params: {},
      query: {},
      headers: {},
    } as IHttpRequest;

    const mockNext = async (): Promise<IHttpResponse> => ({
      statusCode: 200,
      success: true,
      message: 'Success',
      data: {},
      meta: {
        headers: {
          'Server': 'Nginx/1.18.0',
          'X-Powered-By': 'Express',
          'X-Runtime': '0.045s',
        },
      },
    });

    const result = await securityHeaders.handle(mockReq, mockNext);

    expect(result.meta?.headers['Server']).toBeUndefined();
    expect(result.meta?.headers['X-Powered-By']).toBeUndefined();
    expect(result.meta?.headers['X-Runtime']).toBeUndefined();
    expect(result.meta?.headers['X-Frame-Options']).toBe('DENY');
    expect(result.meta?.headers['X-Content-Type-Options']).toBe('nosniff');
  });
});
