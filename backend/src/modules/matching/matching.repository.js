import { readDatabase } from '../../database/connection.js';
export async function getMatchingInputs() { const db = await readDatabase(); return { students: db.students || [], jobs: db.jobs || [] }; }
