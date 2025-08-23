import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError.js';

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Normalize to minimal 500 if it's not an AppError
  const appErr =
    err instanceof AppError
      ? err
      : AppError.internal('Internal server error', { cause: err });

  const status = appErr.httpStatus;
  const is4xx = status >= 400 && status < 500;

  const payload: Record<string, unknown> = {
    success: false,
    status,
    error: appErr.error,
    message: appErr.message,
  };

  // Only 4xx responses may include details
  if (is4xx && appErr.details) payload.details = appErr.details;

  // Log server-side (never leak cause to client)
  // eslint-disable-next-line no-console
  console.error('❌ Error:', {
    status,
    error: appErr.error,
    message: appErr.message,
    causeName: (appErr.cause as any)?.name,
    causeMessage: (appErr.cause as any)?.message,
  });

  res.status(status).json(payload);
}
