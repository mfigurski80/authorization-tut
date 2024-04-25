import { App } from '@tinyhttp/app';
import { GRPC as Cerbos } from "@cerbos/grpc";

import { authenticate, reply, roleDB } from './userSession.js';

const cerbos = new Cerbos("localhost:3592", { tls: false });
async function authorize(user, action, feature) {
  const roles = await roleDB.get(user);
  const resp = await cerbos.checkResource({
    principal: { id: user, roles },
    resource: {
      kind: feature,
      id: "test",
      attributes: {},
    },
    actions: [action] 
  });
  switch (resp.actions[action]) { 
    case "EFFECT_ALLOW":
      return true;
    case "EFFECT_DENY":
      return false;
    default:
      console.error("Unexpected effect: ", resp);
      return false;
  }
};

const app = new App();
app.get('cerbos/', (req, res) => {
  const user = authenticate(req);
  if (!user) return reply.unauthed(res);
  return res.send('<h3>Hello from Cerbos!</h3>');
});
app.get('cerbos/cases', async (req, res) => {
  const user = authenticate(req);
  if (!user) return reply.unauthed(res);
  const can = await authorize(user, 'list', 'case');
  if (!can) return reply.forbidden(res);
  return res.send('<h3>Youve listed cases!</h3>');
});
app.post('cerbos/cases', async (req, res) => {
  const user = authenticate(req);
  if (!user) return reply.unauthed(res);
  const can = await authorize(user, 'create', 'case');
  if (!can) return reply.forbidden(res);
  return res.send('<h3>Youve created a case!</h3>');
});

export default app;
