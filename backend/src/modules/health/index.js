export const healthRouter = { method: 'GET', matches: (pathname) => pathname === '/api/health', handler: async () => ({ status: 'ok', service: 'campuslink-api' }) };
