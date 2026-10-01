import { listMatchesController } from './matching.controller.js';
import { validateId } from './matching.validation.js';
export const matchingRouter = { method: 'GET', matches: p => p === '/api/matching' || /^\/api\/matching\/[^/]+(?:\/[^/]+)?$/.test(p), handler: async ({ url }) => { const parts = url.pathname.split('/').filter(Boolean); const jobId = parts[2]; const studentId = parts[3]; if (!jobId) return listMatchesController(); if (!validateId(jobId) || (studentId && !validateId(studentId))) throw new Error('Invalid matching id'); return listMatchesController(jobId, studentId); } };
