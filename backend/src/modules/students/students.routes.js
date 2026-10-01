import { getStudentController, listStudentsController } from './students.controller.js';
export const studentsRouter = { method: 'GET', matches: pathname => pathname === '/api/students' || /^\/api\/students\/[^/]+$/.test(pathname), handler: async ({ url }) => { const id = url.pathname.split('/')[3]; return id ? getStudentController(id) : listStudentsController(); } };
