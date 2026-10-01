import { getDrive, getDrives } from './drives.service.js';
export async function listDrivesController(filters) { return getDrives(filters); }
export async function getDriveController(id) { return getDrive(id); }
