"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponseEnvelopeDTO = void 0;
const abstraction_1 = require("../../abstraction");
class BaseResponseEnvelopeDTO extends abstraction_1.ModuleBaseDTO {
    transactionUrn;
    status;
    responseMessage;
    responseKey;
    errors;
    timestamp;
    metadata;
    data;
    referenceUrn;
    constructor(params) {
        super();
        this.transactionUrn = params.transactionUrn || '';
        this.status = params.status || 'SUCCESS';
        this.responseMessage = params.responseMessage || 'Operation completed successfully';
        this.responseKey = params.responseKey || 'SUCCESS';
        this.errors = params.errors || [];
        this.timestamp = params.timestamp || new Date().toISOString();
        this.metadata = params.metadata || {};
        this.data = params.data !== undefined ? params.data : {};
        this.referenceUrn = params.referenceUrn || '';
    }
    static success(data, message = 'Success', responseKey = 'SUCCESS') {
        return new BaseResponseEnvelopeDTO({
            status: 'SUCCESS',
            responseMessage: message,
            responseKey,
            data,
        });
    }
    static error(message, responseKey = 'INTERNAL_SERVER_ERROR', errors = []) {
        return new BaseResponseEnvelopeDTO({
            status: 'FAILED',
            responseMessage: message,
            responseKey,
            errors,
            data: null,
        });
    }
}
exports.BaseResponseEnvelopeDTO = BaseResponseEnvelopeDTO;
