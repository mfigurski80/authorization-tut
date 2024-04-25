import { App } from '@tinyhttp/app';
import JSONdb from 'simple-json-db';

/** assign request to user */
export function authenticate(req) {
  if (!req.headers?.authorization) {
    return undefined;
  } 
  const tok = req.headers.authorization.split(' ')[1];
  const decoded = Buffer.from(tok, 'base64').toString('utf-8');
  return decoded.split(':')[0];
}

export const reply = {
  unauthed(res) {
    return res.status(401).send('Failed Authentication'); 
  },
  forbidden(res) {
    return res.status(403).send('Not Authorized');
  },
  bad(res, msg) {
    return res.status(400).json({ error: msg });
  },
  success(res) {
    return res.status(204).send(); 
  }
}

const ALLOWED_ROLES = ['user', 'admin']
export const roleDB = new JSONdb('./roles.tmp.json');

export const roleRouter = new App();
roleRouter.get('role', (_, res) => {
  return res.json(roleDB.JSON());
});
roleRouter.get('role/:usr', (req, res) => {
  return res.json(roleDB.get(req.params.usr));
});
roleRouter.post('role/:usr/:role', (req, res) => {
  const { usr, role } = req.params;
  if (!ALLOWED_ROLES.includes(role)) {
    return reply.bad(res, `Invalid Role: ${role}`);
  }
  if (!roleDB.has(usr)) {
    roleDB.set(usr, [role]);
  } else {
    const roles = roleDB.get(usr);
    roles.push(role);
    roleDB.set(usr, Array.from(new Set(roles)));
  }
  return reply.success(res);
});
roleRouter.delete('role/:usr/:role', (req, res) => {
  const { usr, role } = req.params;
  if (!roleDB.has(usr)) {
    return reply.bad(res, `User ${usr} not found`);
  }
  const roles = roleDB.get(usr);
  const newRoles = roles.filter(r => r !== role);
  roleDB.set(usr, newRoles);
  return reply.success(res);
});
