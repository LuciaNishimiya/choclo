import { Hono } from "hono"

import { pages } from "../views/index.js"
import { authRoutes } from "./auth.js"
import { systemRoutes } from "./system.js"

export const router = new Hono()
// Pages routes
router.route('/', pages)


router.route('api/auth', authRoutes)
router.route('api/system', systemRoutes)
