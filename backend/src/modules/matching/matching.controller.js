import { getAllMatches, getMatches } from './matching.service.js';
export async function listMatchesController(jobId, studentId) { return jobId ? getMatches(jobId, studentId) : getAllMatches(); }
