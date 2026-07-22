import { ModuleBaseConstant } from './abstraction';

export class CacheTtlConstant extends ModuleBaseConstant {
  public static readonly FIVE_SECONDS = 5;
  public static readonly ONE_MINUTE = 60;
  public static readonly FIVE_MINUTES = 300;
  public static readonly FIFTEEN_MINUTES = 900;
  public static readonly ONE_HOUR = 3600;
  public static readonly ONE_DAY = 86400;
}
