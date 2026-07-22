"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericSearchRequestDTO = exports.DateRangeFilterDTO = exports.FilterConditionDTO = exports.SortRequestDTO = exports.CursorPaginationRequestDTO = exports.PaginationRequestDTO = void 0;
const dto_1 = require("../../abstractions/dto");
class PaginationRequestDTO extends dto_1.ModuleBaseDTO {
    page;
    limit;
    constructor(page = 1, limit = 20) {
        super();
        this.page = page;
        this.limit = limit;
    }
}
exports.PaginationRequestDTO = PaginationRequestDTO;
class CursorPaginationRequestDTO extends dto_1.ModuleBaseDTO {
    cursor;
    limit;
    constructor(cursor, limit = 20) {
        super();
        this.cursor = cursor;
        this.limit = limit;
    }
}
exports.CursorPaginationRequestDTO = CursorPaginationRequestDTO;
class SortRequestDTO extends dto_1.ModuleBaseDTO {
    field;
    order;
    constructor(field, order = 'ASC') {
        super();
        this.field = field;
        this.order = order;
    }
}
exports.SortRequestDTO = SortRequestDTO;
class FilterConditionDTO extends dto_1.ModuleBaseDTO {
    field;
    operator;
    value;
    constructor(field, operator, value) {
        super();
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
}
exports.FilterConditionDTO = FilterConditionDTO;
class DateRangeFilterDTO extends dto_1.ModuleBaseDTO {
    startDate;
    endDate;
    constructor(startDate, endDate) {
        super();
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
exports.DateRangeFilterDTO = DateRangeFilterDTO;
class GenericSearchRequestDTO extends dto_1.ModuleBaseDTO {
    query;
    pagination;
    sorting;
    filters;
    dateRange;
    constructor(query, pagination, sorting, filters, dateRange) {
        super();
        this.query = query;
        this.pagination = pagination;
        this.sorting = sorting;
        this.filters = filters;
        this.dateRange = dateRange;
    }
}
exports.GenericSearchRequestDTO = GenericSearchRequestDTO;
