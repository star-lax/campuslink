import { findOfferById, listOffers } from './offers.repository.js';
import { readDatabase } from '../../database/connection.js';
function withRelations(offer, db) { if (!offer) return null; const student = (db.students || []).find(s => s.id === offer.studentId) || null; const company = (db.companies || []).find(c => c.name === offer.companyName) || null; const job = (db.jobs || []).find(j => j.companyName === offer.companyName && j.role === offer.role) || null; return { ...offer, student: student ? { id: student.id, name: student.name, branch: student.branch } : null, company, job }; }
export async function getOffers(filters) { const db = await readDatabase(); return (await listOffers(filters)).map(o => withRelations(o, db)); }
export async function getOffer(id) { const db = await readDatabase(); return withRelations(await findOfferById(id), db); }
