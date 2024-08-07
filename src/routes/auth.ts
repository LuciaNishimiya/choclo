import { Hono } from 'hono'
import { registerHandler, loginHandler, changePasswordHandler } from '../handlers/auth.js'
import { authMiddleware } from '../middlewares/auth.js'

import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const registerSchema = z.object({
    username: z.string().min(3, "Username is required and must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters")
})

const loginSchema = z.object({
    username: z.string(),
    password: z.string()
})
 
const changePasswordSchema = z.object({
    username: z.string(),
    oldPassword: z.string(),
    newPassword: z.string().min(8, "New password must be at least 8 characters")
})

export const authRoutes = new Hono()

authRoutes.post('/register', zValidator('json', registerSchema), registerHandler)
authRoutes.post('/login', zValidator('json', loginSchema), loginHandler)
authRoutes.put('/password', authMiddleware, zValidator('json', changePasswordSchema), changePasswordHandler);