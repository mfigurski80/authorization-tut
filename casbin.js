import { App } from '@tinyhttp/app';
import { newEnforcer } from 'casbin';
import { authenticate, reply, roleDB } from './userSession.js';

const enforcer = await newEnforcer('./casbin_models/rbac.conf', './casbin_models/roles.csv', );

const app = new App();
app.get('casbin/', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const roles = enforcer.getRolesForUser(usr);
  return res.send('<h3>Hello ${usr}, from Casbin!</h3>');
});
app.get('casbin/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const can = await enforcer.enforce(usr, 'case', 'list');
  if (!can) return reply.forbidden(res);
  return res.send('<h3>Youve listed cases!</h3>');
});
app.post('casbin/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const can = await enforcer.enforce(usr, 'case', 'create');
  if (!can) return reply.forbidden(res);
  return res.send('<h3>Youve created a case!</h3>');
});

export default app;
