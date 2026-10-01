import { createServer } from 'node:http';
import { healthRouter } from './modules/health/index.js';
import { studentsRouter } from './modules/students/index.js';
import { readinessRouter } from './modules/readiness/index.js';
import { recruitersRouter } from './modules/recruiters/index.js';
import { jobsRouter } from './modules/jobs/index.js';
import { matchingRouter } from './modules/matching/index.js';
import { drivesRouter } from './modules/drives/index.js';
import { offersRouter } from './modules/offers/index.js';
import { notificationsRouter } from './modules/notifications/index.js';
import { analyticsRouter } from './modules/analytics/index.js';
import { settingsRouter } from './modules/settings/index.js';
import { notificationMutationRouter } from './modules/notifications/notifications.routes.js';
import { createResponse, createError } from './shared/response.js';
const routes = [healthRouter, studentsRouter, readinessRouter, recruitersRouter, jobsRouter, matchingRouter, drivesRouter, offersRouter, notificationsRouter, notificationMutationRouter, analyticsRouter, settingsRouter];
export function createApp() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      const route = routes.find((candidate) => candidate.method === req.method && candidate.matches(url.pathname));
      if (!route) return createError(res, 404, 'Route not found');
      const data = await route.handler({ req, res, url });
      if (data === null) return createError(res, 404, 'Resource not found');
      return createResponse(res, 200, data);
    } catch (error) { console.error(error); return createError(res, error.statusCode || 500, error.statusCode ? error.message : 'Internal server error'); }
  });
}
