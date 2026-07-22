import { IQueueClient } from './abstraction';
import { InMemoryQueueDriver } from './in_memory_driver';
import { RabbitMQQueueDriver, IRabbitMQConfig } from './rabbitmq_driver';

export type QueueDriverType = 'in_memory' | 'memory' | 'rabbitmq' | 'amqp' | string;

export interface IQueueConfig {
  type?: QueueDriverType;
  rabbitmqConfig?: IRabbitMQConfig;
  customClient?: IQueueClient;
}

export class QueueClientFactory {
  public static createClient(config: IQueueConfig = {}): IQueueClient {
    if (config.customClient) {
      return config.customClient;
    }

    const type = (config.type || process.env.QUEUE_TYPE || 'in_memory').toLowerCase();

    switch (type) {
      case 'rabbitmq':
      case 'amqp':
        return new RabbitMQQueueDriver(config.rabbitmqConfig);
      case 'in_memory':
      case 'memory':
      default:
        return new InMemoryQueueDriver();
    }
  }
}
