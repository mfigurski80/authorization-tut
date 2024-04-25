import { App } from '@tinyhttp/app';
import { defineAbility } from '@casl/ability';
import { authenticate, reply, roleDB } from './userSession.js';

const app = new App();

const abilityFactory = async (user) => {
  const roles = await roleDB.get(user) || [];
  return defineAbility(async (can) => {
    if (user === 'root') {
      can('manage', 'all');
    }
    roles.forEach(r => {
      switch (r) {
        case 'admin':
          can('create', 'case');
          can('delete', 'case');
        case 'user':
          can('read', 'case');
      }
    });
  });
};

app.get('casl/', (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  res.send(`<h3>Hello ${usr} from Casl!</h3>`);
});
app.get('casl/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const ability = await abilityFactory(usr);
  if (!ability.can('read', 'case')) {
    return reply.forbidden(res);
  }
  res.send('<h3>Youve listed cases!</h3>');
});
app.post('casl/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const ability = await abilityFactory(usr);
  if (!ability.can('create', 'case')) {
    return reply.forbidden(res);
  }
  res.send('<h3>Youve created a case!</h3>');
});

export default app;
