import express from 'express';
import errorHandler from './middleware/error-handler.js';
import notFound from './middleware/not-found.js';
import responseHelpers from './middleware/response.js';
import { systemRouter } from './modules/system/system.routes.js';

const app = express();

app.use(responseHelpers);

app.use('/', systemRouter);

// Root route
app.get('/', (_req, res) => {
  console.log('Root route');
  res.success();
});

// Suppress Chrome DevTools discovery request noise
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.status(204).end();
});

// 404 + error handling last
app.use(notFound);
app.use(errorHandler);

export default app;
