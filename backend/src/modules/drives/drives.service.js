import { findDriveById, listDrives } from './drives.repository.js';
import { readDatabase } from '../../database/connection.js';
function withRelations(drive, db) { if (!drive) return null; const jobs = (drive.jobIds || []).map(id => (db.jobs || []).find(j => j.id === id)).filter(Boolean); const companies = jobs.map(j => (db.companies || []).find(c => c.id === j.companyId)).filter(Boolean); return { ...drive, jobs, companies }; }
export async function getDrives(filters) { const db = await readDatabase(); return (await listDrives(filters)).map(d => withRelations(d, db)); }
export async function getDrive(id) { const db = await readDatabase(); return withRelations(await findDriveById(id), db); }
