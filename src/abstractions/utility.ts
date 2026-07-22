export interface IUtility {
  // Base interface contract for utility helpers
}

export abstract class BaseUtility implements IUtility {
  public static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }
}
