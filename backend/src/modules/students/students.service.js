import { findStudentById, listStudents } from './students.repository.js';
export async function getStudents() { return listStudents(); }
export async function getStudent(id) { return findStudentById(id); }
