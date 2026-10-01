import { findRecruiterById, listRecruiters } from './recruiters.repository.js';
export async function getRecruiters(id) { return id ? findRecruiterById(id) : listRecruiters(); }
