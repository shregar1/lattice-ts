import { ModuleBaseUtility } from './abstraction';

export abstract class BaseMapper<TSource, TTarget> extends ModuleBaseUtility {
  public abstract map(source: TSource): TTarget;

  public mapArray(sources: TSource[]): TTarget[] {
    return sources.map((s) => this.map(s));
  }
}
