import { ModuleBaseUtility } from '../abstraction';

export enum TenantIsolationStrategyType {
  HEADER_BASED = 'header_based',
  SCHEMA_BASED = 'schema_based',
  DATABASE_PER_TENANT = 'database_per_tenant',
}

export interface ITenantIsolationStrategy {
  strategyType: TenantIsolationStrategyType;
  resolveTenantId(context: any): string;
  applyIsolationBoundary(tenantId: string, connection: any): Promise<any>;
}

export abstract class BaseTenantIsolationStrategy extends ModuleBaseUtility implements ITenantIsolationStrategy {
  abstract strategyType: TenantIsolationStrategyType;
  abstract resolveTenantId(context: any): string;
  abstract applyIsolationBoundary(tenantId: string, connection: any): Promise<any>;
}
