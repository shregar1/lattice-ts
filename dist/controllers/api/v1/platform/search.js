"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPlatformController = void 0;
const abstraction_1 = require("../../../abstraction");
class SearchPlatformController extends abstraction_1.ModuleBaseController {
    async handle(req) {
        const searchResult = {
            items: [],
            total: 0,
            page: req.body?.pagination?.page || 1,
            limit: req.body?.pagination?.limit || 20,
            totalPages: 0,
        };
        return this.success(searchResult, 'Search query executed successfully', 'SEARCH_SUCCESS', req.context);
    }
}
exports.SearchPlatformController = SearchPlatformController;
