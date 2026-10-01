import { getJobController, listJobsController } from './jobs.controller.js';
import { validateJobId } from './jobs.validation.js';
export const jobsRouter = { method: 'GET', matches: p => p === '/api/jobs' || /^\/api\/jobs\/[^/]+$/.test(p), handler: async ({ url }) => { const id = url.pathname.split('/')[3]; if (!id) return listJobsController(); if (!validateJobId(id)) throw new Error('Invalid job id'); return getJobController(id); } };
