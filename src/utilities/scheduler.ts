import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';

export type TaskHandler = () => Promise<void>;

export interface IScheduledJob {
  name: string;
  intervalMs: number;
  handler: TaskHandler;
  timerId?: NodeJS.Timeout;
}

export class SchedulerUtility extends ModuleBaseUtility {
  private static jobs = new Map<string, IScheduledJob>();
  public readonly logger: ILogger;

  constructor(logger?: ILogger) {
    super();
    this.logger = logger || new StructuredLogger(this.constructor.name);
  }

  public scheduleRecurring(name: string, intervalMs: number, handler: TaskHandler): void {
    if (SchedulerUtility.jobs.has(name)) {
      this.cancel(name);
    }

    const timerId = setInterval(async () => {
      try {
        await handler();
      } catch (err) {
        this.logger.error(`Scheduled task '${name}' failed:`, err);
      }
    }, intervalMs);

    SchedulerUtility.jobs.set(name, { name, intervalMs, handler, timerId });
    this.logger.info(`Scheduled recurring task '${name}' every ${intervalMs}ms`);
  }

  public cancel(name: string): boolean {
    const job = SchedulerUtility.jobs.get(name);
    if (!job) return false;

    if (job.timerId) {
      clearInterval(job.timerId);
    }
    SchedulerUtility.jobs.delete(name);
    this.logger.info(`Cancelled scheduled task '${name}'`);
    return true;
  }

  public stopAll(): void {
    for (const name of SchedulerUtility.jobs.keys()) {
      this.cancel(name);
    }
  }
}
