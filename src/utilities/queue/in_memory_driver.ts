import { BaseQueueClient, IQueueMessage, QueueHandler } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export class InMemoryQueueDriver extends BaseQueueClient {
  private readonly logger: ILogger = new StructuredLogger('InMemoryQueueDriver');
  private handlers = new Map<string, QueueHandler[]>();

  public async publish<T = any>(topic: string, payload: T): Promise<string> {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const msg: IQueueMessage<T> = {
      id,
      topic,
      payload,
      timestamp: new Date().toISOString(),
    };

    const topicHandlers = this.handlers.get(topic) || [];
    this.logger.info(`[InMemoryQueue] Published message '${id}' to topic '${topic}' (${topicHandlers.length} subscribers)`);

    setImmediate(async () => {
      for (const handler of topicHandlers) {
        try {
          await handler(msg);
        } catch (err: any) {
          this.logger.error(`[InMemoryQueue] Error executing handler for topic '${topic}': ${err.message}`);
        }
      }
    });

    return id;
  }

  public async subscribe<T = any>(topic: string, handler: QueueHandler<T>): Promise<void> {
    const list = this.handlers.get(topic) || [];
    list.push(handler);
    this.handlers.set(topic, list);
    this.logger.info(`[InMemoryQueue] Subscribed handler to topic '${topic}'`);
  }

  public getDriverName(): string {
    return 'in_memory';
  }
}
