import { BaseTenantIsolationStrategy, TenantIsolationStrategyType } from './abstraction';
import { StructuredLogger, ILogger } from '../logger';

export class HeaderBasedTenantIsolationStrategy extends BaseTenantIsolationStrategy {
  private readonly logger: ILogger = new StructuredLogger('HeaderBasedTenantIsolationStrategy');
  public readonly strategyType = TenantIsolationStrategyType.HEADER_BASED;

  public resolveTenantId(context: any): string {
    return context?.headers?.['x-tenant-id'] || context?.tenantId || 'default_tenant';
  }

  public async applyIsolationBoundary(tenantId: string, connection: any): Promise<any> {
    this.logger.info(`Applying header-based isolation boundary for tenant '${tenantId}'`);
    return connection;
  }
}
