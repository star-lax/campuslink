import { findReadinessByStudentId, listReadiness } from './readiness.repository.js';
export async function getReadiness(studentId) { return studentId ? findReadinessByStudentId(studentId) : listReadiness(); }
