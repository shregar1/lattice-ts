import { IController, BaseController } from '../abstractions/controller';

export interface IModuleController extends IController {
  // Base interface for all controllers in the controllers module
}

export abstract class ModuleBaseController extends BaseController implements IModuleController {
  // Module-level base controller logic
}
