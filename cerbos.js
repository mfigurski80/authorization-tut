import { App } from '@tinyhttp/app';
import { GRPC as Cerbos } from "@cerbos/grpc";

import { authenticate, forbid } from './authenticate.js';

const cerbos = new Cerbos("localhost:3592", { tls: false });
async function authorize(user, action, feature) {
  const resp = await cerbos.checkResource({
    principal: { id: user, roles: ['user']},
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
  if (!user) return forbid(res);
  return res.send('<h3>Hello from Cerbos!</h3>');
});
app.get('cerbos/cases', async (req, res) => {
  const user = authenticate(req);
  if (!user) return forbid(res);
  const can = await authorize(user, 'list', 'case');
  if (!can) return res.status(403).send('Not Authorized');
  return res.send('<h3>Youve listed cases!</h3>');
});

export default app;
