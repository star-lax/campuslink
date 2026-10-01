import { readDatabase } from '../../database/connection.js';
export async function listReadiness() { return (await readDatabase()).students.map(toReadiness); }
export async function findReadinessByStudentId(studentId) { const student = (await readDatabase()).students.find(candidate => candidate.id === studentId); return student ? toReadiness(student) : null; }
function toReadiness(student) { return { studentId: student.id, readinessScore: student.readinessScore, readinessBand: student.readinessBand, skillScores: student.skillScores, mockInterviews: student.mockInterviews, certifications: student.certifications, projects: student.projects, riskFlags: student.riskFlags, recommendedActions: student.recommendedActions, placementStatus: student.placementStatus }; }
