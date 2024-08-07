import type { Context, Next } from 'hono'
import { jwt, verify } from 'hono/jwt'
import { secureHeaders } from 'hono/secure-headers'
import { getSecret } from '../services/jwt.js'
const JwtSecret = await getSecret() || process.env.JWT_SECRET

export const secureHeadersMiddleware = secureHeaders()
export async function authMiddleware(c: Context, next: Next) {
    const jwtMiddleware = jwt({
        secret: JwtSecret,
        cookie: 'authToken',
    })
    return jwtMiddleware(c, next)
}

export async function authQueryMiddleware(c: Context, next: Next) {
    const tokenToVerify = c.req.query('token') as string
    try {
        const decodedToken = await verify(tokenToVerify, JwtSecret)
        if (decodedToken) return next()
    } catch (error) {
        c.status(401)
        return c.json({ error: 'Unauthorized' })
    }
}