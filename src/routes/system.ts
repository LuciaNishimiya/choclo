import { spawn } from 'bun-pty'
import { Hono } from 'hono'
export const systemRoutes = new Hono()

import { terminalHandler } from '../handlers/system.js'
import { authQueryMiddleware } from '../middlewares/auth.js'

systemRoutes.get(
  '/ws',
  authQueryMiddleware,
  terminalHandler
) 