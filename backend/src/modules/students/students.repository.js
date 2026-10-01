import { readDatabase } from '../../database/connection.js';
export async function listStudents() { return (await readDatabase()).students; }
export async function findStudentById(id) { return (await listStudents()).find(student => student.id === id) || null; }
