import { App } from '@tinyhttp/app';
import { Oso } from 'oso-cloud';
import { authenticate, reply, roleDB } from './userSession.js';

/** NOTE: following policy is built into OSO cloud UI:
 * global {
 *   roles = ["user", "admin"];
 * }
 * actor User {}
 * resource Case {
 *   roles = ["viewer", "owner"];
 *   permissions = ["read", "create", "delete"];
 *   "viewer" if global "user";
 *   "owner" if global "admin";
 *   "read" if "viewer";
 *   "read" if "owner";
 *   "create" if "owner";
 *   "delete" if "owner";
 * }
 */
const API_KEY="e_3wx6VCK6WqKwtk8hwyTSk7_EtayGNmShYu_46leh3dv7D9mUqWxXkVLzp3HPI1m"
const oso = new Oso("https://cloud.osohq.com", API_KEY);

const app = new App();
app.get('oso/', (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  res.send(`<h3>Hello ${usr} from Oso!</h3>`);
});
app.get('oso/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const actor = { type: 'User', id: usr };
  const feature = { type: 'Case', id: 'all' };
  const decision = await oso.authorize(actor, 'read', feature);
  if (!decision) return reply.forbidden(res);
  res.send(`<h3>Listing cases!</h3>`);
});
app.post('oso/case', async (req, res) => {
  const usr = authenticate(req);
  if (!usr) return reply.unauthed(res);
  const actor = { type: 'User', id: usr };
  const feature = { type: 'Case', id: 'all' };
  const decision = await oso.authorize(actor, 'create', feature);
  if (!decision) return reply.forbidden(res);
  res.send(`<h3>Creating a case!</h3>`);
});


export default app;
