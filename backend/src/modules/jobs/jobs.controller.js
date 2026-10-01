import { getJobs } from './jobs.service.js';
export async function listJobsController() { return getJobs(); }
export async function getJobController(id) { return getJobs(id); }
