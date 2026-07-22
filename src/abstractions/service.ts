import { ILogger, StructuredLogger } from '../utilities/logger';

export interface IHasLogger {
  readonly logger: ILogger;
}

export interface IService extends IHasLogger {
  // Base interface for services
}

export abstract class BaseService implements IService {
  public readonly logger: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  protected logActivity(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, meta);
  }
}
