export function validateNotificationId(id) { return typeof id === 'string' && id.trim().length > 0; }
export function validateFilters(query) { if (query.read && !['true', 'false'].includes(query.read)) { const e = new Error('Invalid read filter'); e.statusCode = 400; throw e; } return query; }
