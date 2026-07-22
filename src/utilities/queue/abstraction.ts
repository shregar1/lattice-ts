import { ModuleBaseUtility } from '../abstraction';

export interface IQueueMessage<T = any> {
  id: string;
  topic: string;
  payload: T;
  timestamp: string;
}

export type QueueHandler<T = any> = (message: IQueueMessage<T>) => Promise<void>;

export interface IQueueClient {
  publish<T = any>(topic: string, payload: T): Promise<string>;
  subscribe<T = any>(topic: string, handler: QueueHandler<T>): Promise<void>;
  getDriverName(): string;
}

export abstract class BaseQueueClient extends ModuleBaseUtility implements IQueueClient {
  abstract publish<T = any>(topic: string, payload: T): Promise<string>;
  abstract subscribe<T = any>(topic: string, handler: QueueHandler<T>): Promise<void>;
  abstract getDriverName(): string;
}
