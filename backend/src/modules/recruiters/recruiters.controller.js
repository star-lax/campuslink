import { getRecruiters } from './recruiters.service.js';
export async function listRecruitersController() { return getRecruiters(); }
export async function getRecruiterController(id) { return getRecruiters(id); }
