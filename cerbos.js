import { App } from '@tinyhttp/app';
// import { GRPC as Cerbos } from "@cerbos/node-client";

// const cerbos = new Cerbos("localhost:3592", { tls: false });
const app = new App();

app.get('/', (_, res) => {
  return res.send('<h3>Hello from Cerbos!</h3>');
});

app.get('/resource', (_, res) => {
  return res.send('<h3>Resource</h3>');
});

export default app;
