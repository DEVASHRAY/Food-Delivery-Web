// src/middleware/error-handler.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError.js';

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Normalize to AppError
  const appErr =
    err instanceof AppError
      ? err
      : AppError.internal('Internal server error', { cause: err });

  // If headers are already sent, delegate to Express default handler
  if (res.headersSent) return next(appErr);

  const status = appErr.httpStatus;
  const is4xx = status >= 400 && status < 500;

  // Decide log severity
  const level: 'warn' | 'error' = is4xx && status !== 429 ? 'warn' : 'error';

  // eslint-disable-next-line no-console
  console[level]('❌ Error:', {
    method: req.method,
    path: req.originalUrl,
    status,
    error: appErr.error,
    message: appErr.message,
    requestId: (req as any).id, // useful if request-id middleware is present
    causeName: (appErr.cause as any)?.name,
    causeMessage: (appErr.cause as any)?.message,
  });

  // Build safe payload
  const payload: Record<string, unknown> = {
    success: false,
    status,
    error: appErr.error,
    message: appErr.message,
  };

  // Only 4xx can include details
  if (is4xx && appErr.details) payload.details = appErr.details;

  // Always set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  // Respect HEAD semantics
  if (req.method === 'HEAD') {
    return res.status(status).end();
  }

  return res.status(status).json(payload);
}
