import { readDatabase } from '../../database/connection.js';
export async function listOffers(filters = {}) { const db = await readDatabase(); return (db.offers || []).filter(o => (!filters.studentId || o.studentId === filters.studentId) && (!filters.companyId || o.companyId === filters.companyId) && (!filters.status || o.stage === filters.status)); }
export async function findOfferById(id) { return (await listOffers()).find(o => o.id === id) || null; }
