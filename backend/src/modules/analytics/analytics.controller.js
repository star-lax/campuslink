import { buildAnalytics } from './analytics.service.js';
export async function analyticsController(filters) { return buildAnalytics(filters); }
