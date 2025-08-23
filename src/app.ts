import express from 'express';
import mongoose from 'mongoose';
import errorHandler from './middleware/error-handler.js';
import notFound from './middleware/not-found.js';
import systemRoutes from './routes/system.routes.js';
import responseHelpers from './middleware/response.js';
import { AppError } from './lib/AppError.js';

const app = express();

app.use(responseHelpers);

app.use('/', systemRoutes);

// Root route
app.get('/', (_req, res) => {
  console.log('Root route');
  throw AppError.badRequest();
});

// Suppress Chrome DevTools discovery request noise
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end();
});

// 404 + error handling last
app.use(notFound);
app.use(errorHandler);

export default app;
