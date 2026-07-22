import { ModuleBaseUtility } from './abstraction';
import * as crypto from 'crypto';

export interface IFeatureFlagContext {
  tenantId?: string;
  userId?: string;
  environment?: string;
}

interface IFlagDefinition {
  enabled: boolean;
  tenantOverrides?: Record<string, boolean>;
  userOverrides?: Record<string, boolean>;
  rolloutPercentage?: number;  // 0–100
  environments?: string[];     // only active in these envs
}

export class FeatureFlagUtility extends ModuleBaseUtility {
  private static flags = new Map<string, IFlagDefinition>();
  private static readonly environment = process.env.NODE_ENV || 'development';

  public static setFlag(key: string, definition: boolean | Partial<IFlagDefinition>): void {
    if (typeof definition === 'boolean') {
      FeatureFlagUtility.flags.set(key, { enabled: definition });
    } else {
      FeatureFlagUtility.flags.set(key, { enabled: definition.enabled ?? false, ...definition });
    }
  }

  public static isEnabled(key: string, context?: IFeatureFlagContext): boolean {
    const def = FeatureFlagUtility.flags.get(key);
    if (!def) return false;

    // Environment-specific check
    if (def.environments && def.environments.length > 0) {
      if (!def.environments.includes(FeatureFlagUtility.environment)) return false;
    }

    // Tenant override
    if (context?.tenantId && def.tenantOverrides) {
      const tenantOverride = def.tenantOverrides[context.tenantId];
      if (tenantOverride !== undefined) return tenantOverride;
    }

    // User override
    if (context?.userId && def.userOverrides) {
      const userOverride = def.userOverrides[context.userId];
      if (userOverride !== undefined) return userOverride;
    }

    // Percentage rollout (hash-based, deterministic for same userId)
    if (def.rolloutPercentage !== undefined && context?.userId) {
      const hash = crypto.createHash('md5').update(`${key}:${context.userId}`).digest('hex');
      const bucket = (parseInt(hash.substring(0, 8), 16) % 100);
      return bucket < def.rolloutPercentage;
    }

    return def.enabled;
  }

  public static clearAll(): void {
    FeatureFlagUtility.flags.clear();
  }
}
