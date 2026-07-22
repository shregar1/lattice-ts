import { ModuleBaseUtility } from './abstraction';

export interface IClockService {
  now(): Date;
  timestamp(): number;
}

export interface IUuidService {
  generate(): string;
}

export class SystemClockService extends ModuleBaseUtility implements IClockService {
  public now(): Date {
    return new Date();
  }

  public timestamp(): number {
    return Date.now();
  }
}

export class UuidService extends ModuleBaseUtility implements IUuidService {
  public generate(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
