import { readDatabase, writeDatabase } from '../../database/connection.js';
export async function listNotifications(filters = {}) { const db = await readDatabase(); return (db.notifications || []).filter(n => (!filters.category || n.category === filters.category) && (filters.read === undefined || String(n.read) === filters.read)); }
export async function findNotificationById(id) { return (await listNotifications()).find(n => n.id === id) || null; }
export async function markNotificationRead(id) { const db = await readDatabase(); const item = (db.notifications || []).find(n => n.id === id); if (!item) return null; item.read = true; await writeDatabase(db); return item; }
export async function markAllNotificationsRead() { const db = await readDatabase(); (db.notifications || []).forEach(n => { n.read = true; }); await writeDatabase(db); return db.notifications || []; }
