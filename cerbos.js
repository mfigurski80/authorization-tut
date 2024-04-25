import { App } from '@tinyhttp/app';
// import { GRPC as Cerbos } from "@cerbos/node-client";
// const cerbos = new Cerbos("localhost:3592", { tls: false });

import { authenticate, forbid } from './authenticate.js';

const app = new App();

app.get('cerbos/', (req, res) => {
  const user = authenticate(req);
  if (!user) return forbid(res);

  return res.send('<h3>Hello from Cerbos!</h3>');
});

app.get('cerbos/resource', (req, res) => {
  const user = authenticate(req);
  if (!user) return forbid(res);
  return res.send('<h3>Resource</h3>');
});

export default app;
