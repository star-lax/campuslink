import { readDatabase } from '../../database/connection.js';
export async function listRecruiters() { return (await readDatabase()).companies || []; }
export async function findRecruiterById(id) { return (await listRecruiters()).find(company => company.id === id) || null; }
