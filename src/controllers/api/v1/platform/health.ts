import { IHttpRequest, IHttpResponse } from '../../../../utilities/http';
import { ModuleBaseController } from '../../../abstraction';
import { BaseResponseEnvelopeDTO } from '../../../../dto/controller/responses/base_envelope';

export class HealthCheckController extends ModuleBaseController {
  public async handle(req: IHttpRequest): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    return this.success({ status: 'UP', timestamp: new Date().toISOString() }, 'System health normal', 'HEALTH_OK', req.context);
  }
}

export class ReadinessCheckController extends ModuleBaseController {
  public async handle(req: IHttpRequest): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    return this.success({ database: 'CONNECTED', cache: 'CONNECTED' }, 'System ready for traffic', 'READY_OK', req.context);
  }
}

export class LivenessCheckController extends ModuleBaseController {
  public async handle(req: IHttpRequest): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    return this.success({ alive: true }, 'System process alive', 'LIVE_OK', req.context);
  }
}

export class VersionCheckController extends ModuleBaseController {
  public async handle(req: IHttpRequest): Promise<IHttpResponse<BaseResponseEnvelopeDTO>> {
    return this.success({ name: 'BackendServiceScaffold', version: '1.0.0', apiVersion: 'v1' }, 'API Version Info', 'VERSION_OK', req.context);
  }
}
