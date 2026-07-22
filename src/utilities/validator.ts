import { ModuleBaseUtility } from './abstraction';

export class BaseValidator extends ModuleBaseUtility {
  public static isUuid(val: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  }

  public static isEmail(val: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  }

  public static isPhone(val: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(val);
  }

  public static isIsoDate(val: string): boolean {
    return !isNaN(Date.parse(val));
  }

  public static isPositiveNumber(val: number): boolean {
    return typeof val === 'number' && val > 0;
  }

  public static isEnum<T extends Record<string, any>>(val: any, enumObj: T): boolean {
    return Object.values(enumObj).includes(val);
  }

  public static isNonEmptyString(val: any): boolean {
    return typeof val === 'string' && val.trim().length > 0;
  }
}
