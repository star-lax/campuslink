import { getStudent, getStudents } from './students.service.js';
export async function listStudentsController() { return getStudents(); }
export async function getStudentController(id) { return getStudent(id); }
