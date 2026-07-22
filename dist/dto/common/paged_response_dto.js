"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResponseDTO = exports.SingleResourceResponseDTO = exports.GenericPagedResponseDTO = void 0;
const dto_1 = require("../../abstractions/dto");
class GenericPagedResponseDTO extends dto_1.ModuleBaseDTO {
    items;
    total;
    page;
    limit;
    totalPages;
    constructor(items, total, page, limit, totalPages) {
        super();
        this.items = items;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = totalPages;
    }
}
exports.GenericPagedResponseDTO = GenericPagedResponseDTO;
class SingleResourceResponseDTO extends dto_1.ModuleBaseDTO {
    data;
    metadata;
    constructor(data, metadata) {
        super();
        this.data = data;
        this.metadata = metadata;
    }
}
exports.SingleResourceResponseDTO = SingleResourceResponseDTO;
class CollectionResponseDTO extends dto_1.ModuleBaseDTO {
    items;
    count;
    constructor(items, count) {
        super();
        this.items = items;
        this.count = count;
    }
}
exports.CollectionResponseDTO = CollectionResponseDTO;
