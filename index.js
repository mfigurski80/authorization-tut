import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';

const app = new App({
  noMatchHandler: (req, res) => {
    res.status(404).send('Not Found');
  }
}).use(logger());

app.get('/', (req, res) => {
  return res.send('<h3>Hello, World!</h3>');
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));

