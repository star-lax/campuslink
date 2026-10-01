import { readDatabase } from '../../database/connection.js';
export async function listJobs() { return (await readDatabase()).jobs || []; }
export async function findJobById(id) { return (await listJobs()).find(job => job.id === id) || null; }
