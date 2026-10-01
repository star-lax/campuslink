import { readDatabase } from '../../database/connection.js';
export async function listDrives(filters = {}) { const db = await readDatabase(); return (db.drives || []).filter(d => (!filters.status || d.status === filters.status) && (!filters.date || d.date === filters.date) && (!filters.companyId || d.companyId === filters.companyId) && (!filters.jobId || d.jobIds?.includes(filters.jobId))); }
export async function findDriveById(id) { return (await listDrives()).find(d => d.id === id) || null; }
