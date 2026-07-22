import { ModuleBaseUtility } from './abstraction';
import { ILogger, StructuredLogger } from './logger';

export type VersionStrategy = 'uri' | 'header';

export interface IVersionConfig {
  version: string;
  strategy: VersionStrategy;
  deprecated?: boolean;
  deprecatedSince?: string;
  sunsetDate?: string;
}

class ApiVersionRegistryClass extends ModuleBaseUtility {
  private readonly versions = new Map<string, IVersionConfig>();
  public readonly logger: ILogger;

  constructor() {
    super();
    this.logger = new StructuredLogger('ApiVersionRegistry');
  }

  public register(config: IVersionConfig): void {
    this.versions.set(config.version, config);
    this.logger.info(`Registered API version: ${config.version} (strategy: ${config.strategy})`);
  }

  /** Resolve version from URI path — e.g., /api/v1/notes → 'v1' */
  public resolveFromUri(path: string): string | null {
    const match = path.match(/\/api\/(v\d+)\//);
    return match ? match[1] : null;
  }

  /** Resolve version from request header — X-API-Version: v2 */
  public resolveFromHeader(headers: Record<string, string | undefined>): string | null {
    return headers['x-api-version'] ?? null;
  }

  /** Return deprecation headers for a given version if applicable */
  public getDeprecationHeaders(version: string): Record<string, string> {
    const config = this.versions.get(version);
    if (!config?.deprecated) return {};

    const headers: Record<string, string> = {
      'Deprecation': 'true',
    };
    if (config.deprecatedSince) headers['Deprecated-Since'] = config.deprecatedSince;
    if (config.sunsetDate) headers['Sunset'] = config.sunsetDate;
    return headers;
  }

  public getAll(): IVersionConfig[] {
    return [...this.versions.values()];
  }
}

export const ApiVersionRegistry = new ApiVersionRegistryClass();

// Register default versions at module initialization
ApiVersionRegistry.register({ version: 'v1', strategy: 'uri' });
