import { ModuleBaseUtility } from '../abstraction';

export interface ISeeder {
  name: string;
  seed(): Promise<void>;
}

export abstract class BaseSeeder extends ModuleBaseUtility implements ISeeder {
  abstract name: string;
  abstract seed(): Promise<void>;
}
