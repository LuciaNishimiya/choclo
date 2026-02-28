import { spawn } from 'bun-pty'
import { Hono } from 'hono'
export const systemRoutes = new Hono()

import { terminalHandler } from '../handlers/system.js'
import { statsHandler } from '../handlers/stats.js'
import { getProcesses, killProcess } from '../handlers/process.js'
import { authQueryMiddleware, authMiddleware } from '../middlewares/auth.js'

systemRoutes.get(
  '/ws',
  authQueryMiddleware,
  terminalHandler
)

systemRoutes.get(
  '/stats/ws',
  authQueryMiddleware,
  statsHandler
)

systemRoutes.get(
  '/processes',
  authMiddleware,
  getProcesses
)

systemRoutes.delete(
  '/processes/:pid',
  authMiddleware,
  killProcess
)