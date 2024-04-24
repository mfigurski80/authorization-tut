import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';

import cerbosRouter from "./cerbos.js";

const app = new App({
  noMatchHandler: (_, res) => {
    res.status(404).send('Custom Not Found');
  }
}).use(logger());

app.get('/', (_, res) => {
  return res.send('<h3>Hello, World!</h3>');
});

app.use('/cerbos', cerbosRouter);

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));

