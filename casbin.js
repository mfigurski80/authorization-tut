import { App } from '@tinyhttp/app';
import { newEnforcer, Helper } from 'casbin';
import { authenticate, reply, roleDB } from './userSession.js';

const policies = {
  user: ['case:read'],
  admin: ['case:read', 'case:create', 'case:delete'],
};
const casbinAdapter = {
  loadPolicy: async (model) => {
    // load `policies`
    Object.entries(policies).forEach(([role, perms]) => {
      perms.forEach(perm => {
        const [obj, act] = perm.split(':');
        Helper.loadPolicyLine(`p, ${role}, ${obj}, ${act}`, model);
      });
    });
    // load roles
    const roles = roleDB.JSON();
    Object.entries(roles).forEach(([user, role]) => {
      Helper.loadPolicyLine(`g, ${user}, ${role}`, model);
    });
  },
};
const enforcer = await newEnforcer('casbin_models/rbac.conf', casbinAdapter);

const app = new App();
app.get('casbin/', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  return res.send(`<h3>Hello ${usr}, from Casbin!</h3>`);
});
app.get('casbin/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const [can, explain] = await enforcer.enforceEx(usr, 'case', 'read');
  if (!can) return reply.forbidden(res);
  console.debug('[casbin] pass:', explain);
  return res.send('<h3>Youve listed cases!</h3>');
});
app.post('casbin/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const [can, explain] = await enforcer.enforceEx(usr, 'case', 'create');
  if (!can) return reply.forbidden(res);
  console.debug('[casbin] pass:', explain);
  return res.send('<h3>Youve created a case!</h3>');
});

export default app;
