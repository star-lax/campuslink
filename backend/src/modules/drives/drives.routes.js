import { getDriveController, listDrivesController } from './drives.controller.js';
import { validateDriveId, validateFilters } from './drives.validation.js';
export const drivesRouter = { method: 'GET', matches: p => p === '/api/drives' || /^\/api\/drives\/[^/]+$/.test(p), handler: async ({ url }) => { const id = url.pathname.split('/')[3]; if (!id) return listDrivesController(validateFilters(Object.fromEntries(url.searchParams.entries()))); if (!validateDriveId(id)) throw new Error('Invalid drive id'); return getDriveController(id); } };
