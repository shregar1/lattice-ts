import { IOrchestrator, BaseOrchestrator } from '../../abstractions/orchestrator';

export interface IModuleOrchestrator extends IOrchestrator {
  // Base interface for all orchestrators in the orchestrators module
}

export abstract class ModuleBaseOrchestrator extends BaseOrchestrator implements IModuleOrchestrator {
  // Module-level base orchestrator logic
}
