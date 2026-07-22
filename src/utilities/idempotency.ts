import { ModuleBaseUtility } from './abstraction';
import { ICacheClient } from './cache';
import { ILogger, StructuredLogger } from './logger';

export class IdempotencyUtility extends ModuleBaseUtility {
  public readonly logger: ILogger;

  constructor(
    private readonly cacheClient: ICacheClient,
    logger?: ILogger
  ) {
    super();
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  public async executeIdempotent<T>(
    idempotencyKey: string,
    operation: () => Promise<T>,
    ttlSeconds: number = 86400
  ): Promise<T> {
    const cacheKey = `idempotency:${idempotencyKey}`;
    const cachedResponse = await this.cacheClient.get<T>(cacheKey);
    if (cachedResponse !== null) {
      this.logger.info(`Replaying cached response for idempotency key '${idempotencyKey}'`);
      return cachedResponse;
    }

    const result = await operation();
    await this.cacheClient.set(cacheKey, result, ttlSeconds);
    return result;
  }
}
