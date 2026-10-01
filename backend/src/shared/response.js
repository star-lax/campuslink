export function createResponse(res, status, data, message = 'Request successful') {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify({ success: status < 400, data, message }));
}
export function createError(res, status, message) { return createResponse(res, status, null, message); }
