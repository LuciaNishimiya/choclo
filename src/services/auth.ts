import { sign, verify } from 'hono/jwt'
import type { SignatureKey } from 'hono/utils/jwt/jws'
import { password } from 'bun'

export const hashPassword = (userPassword: string) =>
  password.hash(userPassword)

export const verifyPassword = (userPassword: string, hashedPassword: string) =>
  password.verify(userPassword, hashedPassword)


export const generateToken = async (JwtSecret: SignatureKey, payload: any) => {
  return await sign(payload, JwtSecret)
}

export const validateToken = async (JwtSecret: SignatureKey, token: string) => {
  return await verify(token, JwtSecret)
}