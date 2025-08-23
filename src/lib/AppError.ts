export const ErrorCodes = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_GATEWAY: 'BAD_GATEWAY',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
} as const;

export type AppErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

type AppErrorOptions = {
  /** Optional numeric code for FE (stable across releases) */
  code?: number;
  /** Structured details (only used for 4xx, never for 5xx) */
  details?: Record<string, unknown>;
  /** Internal cause for logs/observability */
  cause?: unknown;
};

export class AppError extends Error {
  readonly httpStatus: number;
  readonly error: AppErrorCode;
  readonly code?: number;
  readonly details?: Record<string, unknown>;
  readonly cause?: unknown;

  constructor(
    message: string,
    httpStatus: number,
    error: AppErrorCode,
    opts: AppErrorOptions = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.httpStatus = httpStatus;
    this.error = error;
    this.code = opts.code;
    this.details = opts.details;
    this.cause = opts.cause;
    Error.captureStackTrace?.(this, this.constructor);
  }

  // ---------- 4xx ----------
  static badRequest(message = 'Bad request', opts?: AppErrorOptions) {
    return new AppError(message, 400, ErrorCodes.BAD_REQUEST, opts);
  }
  static unauthorized(message = 'Unauthorized', opts?: AppErrorOptions) {
    return new AppError(message, 401, ErrorCodes.UNAUTHORIZED, opts);
  }
  static forbidden(message = 'Forbidden', opts?: AppErrorOptions) {
    return new AppError(message, 403, ErrorCodes.FORBIDDEN, opts);
  }
  static notFound(message = 'Not found', opts?: AppErrorOptions) {
    return new AppError(message, 404, ErrorCodes.NOT_FOUND, opts);
  }
  static conflict(message = 'Conflict', opts?: AppErrorOptions) {
    return new AppError(message, 409, ErrorCodes.CONFLICT, opts);
  }
  static validation(message = 'Validation failed', opts?: AppErrorOptions) {
    return new AppError(message, 400, ErrorCodes.VALIDATION_ERROR, opts);
  }

  // ---------- 5xx (never expose details) ----------
  static internal(
    message = 'Internal server error',
    opts?: Omit<AppErrorOptions, 'details'>
  ) {
    return new AppError(message, 500, ErrorCodes.INTERNAL_ERROR, opts);
  }
  static badGateway(
    message = 'Bad gateway',
    opts?: Omit<AppErrorOptions, 'details'>
  ) {
    return new AppError(message, 502, ErrorCodes.BAD_GATEWAY, opts);
  }
  static serviceUnavailable(
    message = 'Service unavailable',
    opts?: Omit<AppErrorOptions, 'details'>
  ) {
    return new AppError(message, 503, ErrorCodes.SERVICE_UNAVAILABLE, opts);
  }
  static gatewayTimeout(
    message = 'Gateway timeout',
    opts?: Omit<AppErrorOptions, 'details'>
  ) {
    return new AppError(message, 504, ErrorCodes.GATEWAY_TIMEOUT, opts);
  }

  // ---------- Helpers ----------
  static fromUnknown(err: unknown): AppError {
    // Always generic message for safety
    return AppError.internal('Internal server error', { cause: err });
  }
}
