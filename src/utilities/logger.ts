import { ModuleBaseUtility } from './abstraction';
import * as os from 'os';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | 'FATAL';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4,
  FATAL: 5,
};

export interface ILogger {
  debug(message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, error?: any, meta?: Record<string, any>): void;
  critical(message: string, error?: any, meta?: Record<string, any>): void;
  fatal(message: string, error?: any, meta?: Record<string, any>): void;
}

export class StructuredLogger extends ModuleBaseUtility implements ILogger {
  private readonly hostname: string;
  private readonly environment: string;
  private readonly minLevel: number;

  constructor(private readonly serviceName: string = 'BackendService') {
    super();
    this.hostname = os.hostname();
    this.environment = process.env.NODE_ENV || 'development';
    const configuredLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase() as LogLevel;
    this.minLevel = LOG_LEVEL_PRIORITY[configuredLevel] ?? LOG_LEVEL_PRIORITY.INFO;
  }

  public debug(message: string, meta?: Record<string, any>): void {
    this.log('DEBUG', message, undefined, meta);
  }

  public info(message: string, meta?: Record<string, any>): void {
    this.log('INFO', message, undefined, meta);
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.log('WARN', message, undefined, meta);
  }

  public error(message: string, error?: any, meta?: Record<string, any>): void {
    this.log('ERROR', message, error, meta);
  }

  public critical(message: string, error?: any, meta?: Record<string, any>): void {
    this.log('CRITICAL', message, error, meta);
  }

  public fatal(message: string, error?: any, meta?: Record<string, any>): void {
    this.log('FATAL', message, error, meta);
    // Fatal errors should trigger process exit in production
    if (this.environment === 'production') {
      process.exit(1);
    }
  }

  private log(level: LogLevel, message: string, error?: any, meta?: Record<string, any>): void {
    if (LOG_LEVEL_PRIORITY[level] < this.minLevel) return;

    const entry: Record<string, any> = {
      timestamp: new Date().toISOString(),
      level,
      serviceName: this.serviceName,
      environment: this.environment,
      hostname: this.hostname,
      requestId: meta?.requestUrn || meta?.requestId || 'N/A',
      referenceUrn: meta?.referenceUrn || 'N/A',
      correlationId: meta?.correlationId || 'N/A',
      tenantId: meta?.tenantId || 'N/A',
      userId: meta?.userId || 'N/A',
      message,
      metadata: this.sanitize(meta || {}),
    };

    if (error) {
      entry.error = {
        message: error?.message || String(error),
        stack: error?.stack,
        code: error?.code,
      };
    }

    const output = JSON.stringify(entry);
    if (level === 'ERROR' || level === 'CRITICAL' || level === 'FATAL') {
      console.error(output);
    } else if (level === 'WARN') {
      console.warn(output);
    } else if (level === 'DEBUG') {
      console.debug(output);
    } else {
      console.log(output);
    }
  }

  /** Strip sensitive fields from log metadata */
  private sanitize(meta: Record<string, any>): Record<string, any> {
    const SENSITIVE = new Set(['password', 'passwordHash', 'token', 'secret', 'apiKey', 'authorization', 'creditCard']);
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(meta)) {
      if (SENSITIVE.has(key)) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
}
