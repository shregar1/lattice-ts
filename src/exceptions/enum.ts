import { NotFoundException } from './not_found';
import { UnprocessableEntityException } from './unprocessable_entity';
import { UnauthenticatedException } from './unauthenticated';
import { UnauthorizedException } from './unauthorized';
import { BadRequestException } from './bad_request';
import { ConflictException } from './conflict';
import { ForbiddenException } from './forbidden';
import { InternalServerException } from './internal_server';
import { TimeoutException } from './timeout';
import { BaseException } from './abstraction';

export type ExceptionEnum =
  | { kind: 'NotFound'; exception: NotFoundException }
  | { kind: 'UnprocessableEntity'; exception: UnprocessableEntityException }
  | { kind: 'Unauthenticated'; exception: UnauthenticatedException }
  | { kind: 'Unauthorized'; exception: UnauthorizedException }
  | { kind: 'BadRequest'; exception: BadRequestException }
  | { kind: 'Conflict'; exception: ConflictException }
  | { kind: 'Forbidden'; exception: ForbiddenException }
  | { kind: 'InternalServer'; exception: InternalServerException }
  | { kind: 'Timeout'; exception: TimeoutException };

export class Exception {
  public static NotFound(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'NotFound', exception: new NotFoundException(message, code, errors, details) };
  }

  public static UnprocessableEntity(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'UnprocessableEntity', exception: new UnprocessableEntityException(message, code, errors, details) };
  }

  public static Unauthenticated(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'Unauthenticated', exception: new UnauthenticatedException(message, code, errors, details) };
  }

  public static Unauthorized(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'Unauthorized', exception: new UnauthorizedException(message, code, errors, details) };
  }

  public static BadRequest(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'BadRequest', exception: new BadRequestException(message, code, errors, details) };
  }

  public static Conflict(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'Conflict', exception: new ConflictException(message, code, errors, details) };
  }

  public static Forbidden(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'Forbidden', exception: new ForbiddenException(message, code, errors, details) };
  }

  public static InternalServer(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'InternalServer', exception: new InternalServerException(message, code, errors, details) };
  }

  public static Timeout(message?: string, code?: string, errors?: any[], details?: Record<string, any>): ExceptionEnum {
    return { kind: 'Timeout', exception: new TimeoutException(message, code, errors, details) };
  }

  public static match<R>(
    variant: ExceptionEnum,
    matchers: {
      NotFound?: (err: NotFoundException) => R;
      UnprocessableEntity?: (err: UnprocessableEntityException) => R;
      Unauthenticated?: (err: UnauthenticatedException) => R;
      Unauthorized?: (err: UnauthorizedException) => R;
      BadRequest?: (err: BadRequestException) => R;
      Conflict?: (err: ConflictException) => R;
      Forbidden?: (err: ForbiddenException) => R;
      InternalServer?: (err: InternalServerException) => R;
      Timeout?: (err: TimeoutException) => R;
      _?: (err: BaseException) => R;
    }
  ): R {
    const handler = matchers[variant.kind] || matchers._;
    if (!handler) {
      throw new Error(`Unhandled Exception variant '${variant.kind}' in pattern match`);
    }
    return handler(variant.exception as any);
  }
}
