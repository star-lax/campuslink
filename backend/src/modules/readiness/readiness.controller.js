import { getReadiness } from './readiness.service.js';
export async function listReadinessController() { return getReadiness(); }
export async function getStudentReadinessController(studentId) { return getReadiness(studentId); }
