import { IDependencyContainer, Container } from '../abstractions/dependency';

export interface IModuleDependencyContainer extends IDependencyContainer {
  // Base interface for module-level dependency containers
}

export class ModuleDependencyContainer extends Container implements IModuleDependencyContainer {
  // Module-level dependency container logic
}
