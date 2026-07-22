import { ModuleBaseDTO } from '../../abstractions/dto';

export class GenericPagedResponseDTO<T> extends ModuleBaseDTO {
  constructor(
    public readonly items: T[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number
  ) {
    super();
  }
}

export class SingleResourceResponseDTO<T> extends ModuleBaseDTO {
  constructor(
    public readonly data: T,
    public readonly metadata?: Record<string, any>
  ) {
    super();
  }
}

export class CollectionResponseDTO<T> extends ModuleBaseDTO {
  constructor(
    public readonly items: T[],
    public readonly count: number
  ) {
    super();
  }
}
