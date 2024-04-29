import { App } from '@tinyhttp/app';
import { authenticate, reply, roleDB } from './userSession.js';
import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();
ac
  .grant('user')
    .readAny('case')
  .grant('admin')
    .extend('user')
    .createAny('case')
    .deleteAny('case');
function canUser(usr) {
  const role = roleDB.get(usr);
  return ac.can(role || 'nil');
}


const app = new App();
app.get('accesscontrol/', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  return res.send(`<h3>Hello ${usr}, from Access Control!</h3>`);
});
app.get('accesscontrol/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const allowed = canUser(usr).readAny('case').granted;
  if (!allowed) return reply.forbidden(res);
  return res.send('<h3>Youve listed cases!</h3>');
});

export default app;
