import { ModuleBaseDTO } from '../../abstractions/dto';

export class PaginationRequestDTO extends ModuleBaseDTO {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20
  ) {
    super();
  }
}

export class CursorPaginationRequestDTO extends ModuleBaseDTO {
  constructor(
    public readonly cursor?: string,
    public readonly limit: number = 20
  ) {
    super();
  }
}

export class SortRequestDTO extends ModuleBaseDTO {
  constructor(
    public readonly field: string,
    public readonly order: 'ASC' | 'DESC' = 'ASC'
  ) {
    super();
  }
}

export class FilterConditionDTO extends ModuleBaseDTO {
  constructor(
    public readonly field: string,
    public readonly operator: string,
    public readonly value: any
  ) {
    super();
  }
}

export class DateRangeFilterDTO extends ModuleBaseDTO {
  constructor(
    public readonly startDate: string,
    public readonly endDate: string
  ) {
    super();
  }
}

export class GenericSearchRequestDTO extends ModuleBaseDTO {
  constructor(
    public readonly query?: string,
    public readonly pagination?: PaginationRequestDTO,
    public readonly sorting?: SortRequestDTO[],
    public readonly filters?: FilterConditionDTO[],
    public readonly dateRange?: DateRangeFilterDTO
  ) {
    super();
  }
}
