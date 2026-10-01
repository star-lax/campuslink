const statuses = new Set(['scheduled', 'live', 'completed', 'cancelled', 'rescheduling', 'upcoming']);
export function validateFilters(query) { if (query.status && !statuses.has(query.status)) { const e = new Error('Invalid drive status'); e.statusCode = 400; throw e; } return query; }
export function validateDriveId(id) { return typeof id === 'string' && id.trim().length > 0; }
