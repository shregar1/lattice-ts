"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseEnvelopeFactory = void 0;
const abstraction_1 = require("./abstraction");
const base_envelope_1 = require("../dto/controller/responses/base_envelope");
class ResponseEnvelopeFactory extends abstraction_1.ModuleBaseFactory {
    create(params) {
        return new base_envelope_1.BaseResponseEnvelopeDTO({
            transactionUrn: params.context?.requestUrn || '',
            status: params.status || 'SUCCESS',
            responseMessage: params.message || 'Operation successful',
            responseKey: params.responseKey || 'SUCCESS',
            errors: params.errors || [],
            timestamp: new Date().toISOString(),
            metadata: {},
            data: params.data,
            referenceUrn: params.context?.referenceUrn || '',
        });
    }
    createSuccess(data, message = 'Success', responseKey = 'SUCCESS', context) {
        return this.create({ status: 'SUCCESS', message, responseKey, data, context });
    }
    createError(message, responseKey = 'ERROR', errors = [], context) {
        return this.create({ status: 'FAILED', message, responseKey, errors, data: null, context });
    }
}
exports.ResponseEnvelopeFactory = ResponseEnvelopeFactory;
