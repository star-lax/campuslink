import { findJobById, listJobs } from './jobs.repository.js';
export async function getJobs(id) { return id ? findJobById(id) : listJobs(); }
