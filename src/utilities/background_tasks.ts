import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';

export interface IJob<TData = any> {
  id: string;
  name: string;
  data: TData;
  attempt: number;
}

export type JobProcessor<T = any> = (job: IJob<T>) => Promise<void>;

export interface IJobOptions {
  maxRetries?: number;
  retryDelayMs?: number;
}

interface IDeadLetterJob<T = any> {
  job: IJob<T>;
  failedAt: Date;
  error: string;
}

class BackgroundTaskUtilityClass extends ModuleBaseUtility {
  private readonly processors = new Map<string, { processor: JobProcessor; options: IJobOptions }>();
  private readonly deadLetterQueue: IDeadLetterJob[] = [];
  private queueDepth = 0;
  private isShuttingDown = false;
  public readonly logger: ILogger;

  constructor() {
    super();
    this.logger = new StructuredLogger('BackgroundTaskUtility');

    // Graceful shutdown
    process.on('SIGTERM', () => { this.isShuttingDown = true; });
    process.on('SIGINT', () => { this.isShuttingDown = true; });
  }

  public registerProcessor(jobName: string, processor: JobProcessor, options: IJobOptions = {}): void {
    this.processors.set(jobName, { processor, options });
  }

  public async enqueue<T>(jobName: string, data: T): Promise<string> {
    if (this.isShuttingDown) {
      this.logger.warn(`Dropping job '${jobName}' — system is shutting down`);
      return '';
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.queueDepth++;

    const entry = this.processors.get(jobName);

    setImmediate(async () => {
      await this.processJob({ id: jobId, name: jobName, data, attempt: 1 }, entry);
      this.queueDepth--;
    });

    return jobId;
  }

  private async processJob<T>(job: IJob<T>, entry?: { processor: JobProcessor; options: IJobOptions }): Promise<void> {
    if (!entry) return;

    const { processor, options } = entry;
    const maxRetries = options.maxRetries ?? 3;
    const retryDelay = options.retryDelayMs ?? 1000;

    try {
      await processor(job);
    } catch (err: any) {
      if (job.attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, retryDelay * job.attempt));
        await this.processJob({ ...job, attempt: job.attempt + 1 }, entry);
      } else {
        this.logger.error(`Job '${job.name}' (${job.id}) exhausted retries. Sending to DLQ.`, err);
        this.deadLetterQueue.push({ job, failedAt: new Date(), error: err.message });
      }
    }
  }

  public getDeadLetterQueue(): IDeadLetterJob[] {
    return [...this.deadLetterQueue];
  }

  public getQueueDepth(): number {
    return this.queueDepth;
  }
}

export const BackgroundTaskUtility = new BackgroundTaskUtilityClass();
