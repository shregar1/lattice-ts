import { ModuleBaseUtility } from '../abstraction';

export interface IMigration {
  version: string;
  name: string;
  up(): Promise<void>;
  down(): Promise<void>;
}

export abstract class BaseMigration extends ModuleBaseUtility implements IMigration {
  abstract version: string;
  abstract name: string;
  abstract up(): Promise<void>;
  abstract down(): Promise<void>;
}
