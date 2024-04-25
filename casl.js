import { App } from '@tinyhttp/app';
import { authenticate, reply, roleDB } from './userSession.js';

const app = new App();

app.get('casl/', (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  res.send(`<h3>Hello ${usr} from Casl!</h3>`);
});

export default app;
