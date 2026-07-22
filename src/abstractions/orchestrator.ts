import { IUnitOfWork } from '../utilities/unit_of_work';
import { ILogger, StructuredLogger } from '../utilities/logger';

export interface IHasLogger {
  readonly logger: ILogger;
}

export interface IOrchestrator extends IHasLogger {
  // Base interface for orchestrators
}

export abstract class BaseOrchestrator implements IOrchestrator {
  public readonly logger: ILogger;

  constructor(
    protected readonly unitOfWork: IUnitOfWork,
    logger?: ILogger
  ) {
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  protected async executeInTransaction<T>(work: () => Promise<T>, actionName: string): Promise<T> {
    this.logger.info(`Starting transaction boundary for action: ${actionName}`);
    try {
      const result = await this.unitOfWork.executeInTransaction(work);
      this.logger.info(`Transaction committed successfully for action: ${actionName}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Transaction failed and rolled back for action: ${actionName}`, error);
      throw error;
    }
  }
}
