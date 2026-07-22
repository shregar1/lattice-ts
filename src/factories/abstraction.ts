import { BaseFactory } from '../abstractions/factory';

export interface IModuleFactory<T> {
  create(...args: any[]): T;
}

export abstract class ModuleBaseFactory<T> extends BaseFactory<T> implements IModuleFactory<T> {
  // Module-level base factory logic
}
