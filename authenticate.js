/** assign request to user */
export function authenticate(req) {
  if (!req.headers?.authorization) {
    return undefined;
  } 
  const tok = req.headers.authorization.split(' ')[1];
  const decoded = Buffer.from(tok, 'base64').toString('utf-8');
  return decoded.split(':')[0];
}

export function forbid(res) {
  return res.status(403).send('Forbidden');
}
