import { readDatabase } from '../../database/connection.js';
export async function getAnalyticsInputs() { const db = await readDatabase(); return { students: db.students || [], jobs: db.jobs || [], companies: db.companies || [], drives: db.drives || [], offers: db.offers || [], notifications: db.notifications || [] }; }
