export interface IDependencyContainer {
  register<T>(token: string | symbol, instance: T): void;
  registerFactory<T>(token: string | symbol, factory: () => T): void;
  resolve<T>(token: string | symbol): T;
}

export { Container, DI_TOKENS } from '../dependencies/container';
