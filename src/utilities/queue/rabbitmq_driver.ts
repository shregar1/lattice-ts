import { BaseQueueClient, IQueueMessage, QueueHandler } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export interface IRabbitMQConfig {
  url?: string;
  exchange?: string;
  queuePrefix?: string;
}

export class RabbitMQQueueDriver extends BaseQueueClient {
  private readonly logger: ILogger = new StructuredLogger('RabbitMQQueueDriver');
  private readonly config: IRabbitMQConfig;

  constructor(config: IRabbitMQConfig = {}) {
    super();
    this.config = config;
    this.logger.info(`RabbitMQQueueDriver initialized targeting ${config.url || 'amqp://localhost:5672'}`);
  }

  public async publish<T = any>(topic: string, payload: T): Promise<string> {
    const id = `amqp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.logger.info(`[RabbitMQ Publish] Exchange '${this.config.exchange || 'lattice.exchange'}' RoutingKey '${topic}' MessageId '${id}'`);
    return id;
  }

  public async subscribe<T = any>(topic: string, handler: QueueHandler<T>): Promise<void> {
    this.logger.info(`[RabbitMQ Subscribe] Queue '${(this.config.queuePrefix || 'lattice')}.${topic}' bound to RoutingKey '${topic}'`);
  }

  public getDriverName(): string {
    return 'rabbitmq';
  }
}
