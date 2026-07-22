"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfigDto = void 0;
const abstraction_1 = require("../abstraction");
class DatabaseConfigDto extends abstraction_1.ModuleBaseDTO {
    host;
    port;
    name;
    constructor(host, port, name) {
        super();
        this.host = host;
        this.port = port;
        this.name = name;
    }
}
exports.DatabaseConfigDto = DatabaseConfigDto;
