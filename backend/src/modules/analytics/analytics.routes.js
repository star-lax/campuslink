import { analyticsController } from './analytics.controller.js';
import { validateFilters } from './analytics.validation.js';
export const analyticsRouter = { method: 'GET', matches: p => p === '/api/analytics', handler: async ({ url }) => analyticsController(validateFilters(Object.fromEntries(url.searchParams.entries()))) };
