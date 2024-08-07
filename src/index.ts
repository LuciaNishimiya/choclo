import { Hono } from 'hono'
import { websocket } from 'hono/bun'
import { router } from './routes/index.js'
const app = new Hono()

const port: any = process.env.PORT || 3000;
app.route('/', router);
export default {
  fetch: app.fetch,
  websocket,
  port: port
}