import { ModuleBaseUtility } from './abstraction';

export interface IDomainEvent<TPayload = any> {
  eventName: string;
  occurredAt: Date;
  payload: TPayload;
}

export type EventHandler<T = any> = (event: IDomainEvent<T>) => Promise<void>;

export class EventBusUtility extends ModuleBaseUtility {
  private static handlersMap = new Map<string, EventHandler[]>();

  public static subscribe<T>(eventName: string, handler: EventHandler<T>): void {
    const handlers = EventBusUtility.handlersMap.get(eventName) || [];
    handlers.push(handler);
    EventBusUtility.handlersMap.set(eventName, handlers);
  }

  public static async publish<T>(eventName: string, payload: T): Promise<void> {
    const handlers = EventBusUtility.handlersMap.get(eventName) || [];
    const event: IDomainEvent<T> = {
      eventName,
      occurredAt: new Date(),
      payload,
    };

    for (const handler of handlers) {
      await handler(event);
    }
  }

  public static clearHandlers(): void {
    EventBusUtility.handlersMap.clear();
  }
}
