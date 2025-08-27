import { Router } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../../lib/app-error.js';

export const systemRouter = Router();

systemRouter.get('/health', (_req, res) => {
  res.success();
});

systemRouter.get('/ready', async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw AppError.serviceUnavailable('Service not ready', {
        cause: 'Mongo not connected',
      });
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw AppError.serviceUnavailable('Service not ready', {
        cause: 'Mongo db handle missing',
      });
    }

    await db.admin().ping();
    res.success();
  } catch (err) {
    if (!(err instanceof AppError)) {
      return next(
        AppError.serviceUnavailable('Service not ready', { cause: err })
      );
    }
    next(err);
  }
});
