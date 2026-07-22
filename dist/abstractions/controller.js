"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const base_envelope_1 = require("../dto/controller/responses/base_envelope");
const api_status_1 = require("../constants/api_status");
const message_1 = require("../constants/message");
const response_key_1 = require("../constants/response_key");
const logger_1 = require("../utilities/logger");
const performance_decorator_1 = require("../utilities/performance_decorator");
class BaseController {
    logger;
    constructor(logger) {
        this.logger = logger || new logger_1.StructuredLogger(this.constructor.name);
    }
    envelope(data, message = message_1.MessageConstant.OPERATION_COMPLETED_SUCCESSFULLY, responseKey = response_key_1.ResponseKeyConstant.SUCCESS, statusCode = 200, context) {
        const envelopeDto = new base_envelope_1.BaseResponseEnvelopeDTO({
            transactionUrn: context?.requestUrn || '',
            status: api_status_1.ApiStatusConstant.SUCCESS,
            responseMessage: message,
            responseKey,
            errors: [],
            timestamp: new Date().toISOString(),
            metadata: {},
            data,
            referenceUrn: context?.referenceUrn || '',
        });
        return {
            statusCode,
            success: true,
            message,
            data: envelopeDto,
        };
    }
    success(data, message = message_1.MessageConstant.OPERATION_COMPLETED_SUCCESSFULLY, responseKey = response_key_1.ResponseKeyConstant.SUCCESS, context) {
        return this.envelope(data, message, responseKey, 200, context);
    }
    created(data, message = message_1.MessageConstant.USER_REGISTERED_SUCCESSFULLY, responseKey = response_key_1.ResponseKeyConstant.RESOURCE_CREATED, context) {
        return this.envelope(data, message, responseKey, 201, context);
    }
}
exports.BaseController = BaseController;
__decorate([
    (0, performance_decorator_1.MeasurePerformance)('controller'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object, String, String, Number, Object]),
    __metadata("design:returntype", Object)
], BaseController.prototype, "envelope", null);
