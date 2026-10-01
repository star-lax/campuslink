import { getRecruiterController, listRecruitersController } from './recruiters.controller.js';
import { validateRecruiterId } from './recruiters.validation.js';
export const recruitersRouter = { method: 'GET', matches: p => p === '/api/recruiters' || /^\/api\/recruiters\/[^/]+$/.test(p), handler: async ({ url }) => { const id = url.pathname.split('/')[3]; if (!id) return listRecruitersController(); if (!validateRecruiterId(id)) throw new Error('Invalid recruiter id'); return getRecruiterController(id); } };
