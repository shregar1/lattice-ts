import { MeasurePerformance } from '../../../src/utilities/performance_decorator';

class DummyTestService {
  public logger = { info: jest.fn(), error: jest.fn() };

  @MeasurePerformance('service')
  public async executeOperation(contextObj: any): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return 'done';
  }
}

describe('MeasurePerformance Decorator Unit Tests', () => {
  test('@MeasurePerformance should calculate method execution duration and record sanitized stage metric', async () => {
    const service = new DummyTestService();
    const req: any = { context: { requestUrn: 'urn:req:123', metrics: [] } };

    const result = await service.executeOperation(req);
    expect(result).toBe('done');
    expect(service.logger.info).toHaveBeenCalled();
    expect(req.context.metrics.length).toBe(1);
    expect(req.context.metrics[0].stage).toBe('service');
    expect(req.context.metrics[0].durationMs).toBeGreaterThan(0);
  });
});
