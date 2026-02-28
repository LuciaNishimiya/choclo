import { Hono } from "hono"

import { authRoutes } from "./auth.js"
import { systemRoutes } from "./system.js"

export const router = new Hono()

router.route('api/auth', authRoutes)
router.route('api/system', systemRoutes)
