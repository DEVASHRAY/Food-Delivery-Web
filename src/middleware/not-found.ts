import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/app-error.js';

export default function notFound(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(AppError.notFound('Route not found'));
}
