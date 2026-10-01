import { getOfferController, listOffersController } from './offers.controller.js';
import { validateFilters, validateOfferId } from './offers.validation.js';
export const offersRouter = { method: 'GET', matches: p => p === '/api/offers' || /^\/api\/offers\/[^/]+$/.test(p), handler: async ({ url }) => { const id = url.pathname.split('/')[3]; if (!id) return listOffersController(validateFilters(Object.fromEntries(url.searchParams.entries()))); if (!validateOfferId(id)) { const e = new Error('Invalid offer id'); e.statusCode = 400; throw e; } return getOfferController(id); } };
