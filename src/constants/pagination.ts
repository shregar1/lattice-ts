import { ModuleBaseConstant } from './abstraction';

export class PaginationConstant extends ModuleBaseConstant {
  public static readonly DEFAULT_PAGE = 1;
  public static readonly DEFAULT_LIMIT = 20;
  public static readonly MAX_LIMIT = 100;
  public static readonly DEFAULT_SORT_ORDER = 'DESC';
}
