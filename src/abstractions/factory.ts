export interface IFactory<T> {
  create(...args: any[]): T;
}

export abstract class BaseFactory<T> implements IFactory<T> {
  public abstract create(...args: any[]): T;
}
