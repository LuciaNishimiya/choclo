import type { Context, Next } from 'hono'
import { jwt, verify } from 'hono/jwt'
import { secureHeaders } from 'hono/secure-headers'
import { getSecret } from '../services/jwt.js'
const JwtSecret = process.env.JWT_SECRET || await getSecret() 
export const secureHeadersMiddleware = secureHeaders()
export async function authMiddleware(c: Context, next: Next) {
    const jwtMiddleware = jwt({
        secret: JwtSecret,
        cookie: 'authToken',
        alg: 'HS256',
    })
    return jwtMiddleware(c, next)
}

export async function authQueryMiddleware(c: Context, next: Next) {
    const tokenToVerify = c.req.query('token') as string
    try {
        const decodedToken = await verify(tokenToVerify, JwtSecret, 'HS256')
        if (decodedToken) return next()
    } catch (error) {
        c.status(401)
        return c.json({ error: 'Unauthorized' })
    }
}