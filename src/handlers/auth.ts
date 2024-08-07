import { generateToken, hashPassword, verifyPassword } from '../services/auth.js'
import { createUser, deleteUser, findUserByUsername, updateUserPassword } from '../services/user.js'
import { incrementFailedAttempts, isAccountLocked, resetFailedAttempts } from '../services/loginAttempts.js';
import type { Context } from 'hono';
import { getSecret } from '../services/jwt.js';
import { setCookie } from 'hono/cookie';

export const registerHandler = async (c: Context) => {
  const { username, password } = await c.req.json()
  const user: any = await findUserByUsername(username);
  if (user) {
    return c.json({ error: 'Username is already in use' }, 409)
  }
  const hashedPassword = await hashPassword(password)

  await createUser(username, hashedPassword)

  return c.json({ message: 'Successfully registered user' })
}

export const loginHandler = async (c: Context) => {

  const expirationHours: any = process.env.JWT_EXPIRATION_HOURS;
  const JwtSecret:any =  await getSecret() || process.env.JWT_SECRET
  const { username, password } = await c.req.json()
  if (!username || !password) { 
    return c.json({ error: 'Required username and password' }, 400)
  }

  const user:any = await findUserByUsername(username)
  if (!user) {
    return c.json({ error: 'Invalid username or password' }, 401)
  }
  if (await isAccountLocked(user)) {
    return c.json({ error: 'Account locked due to multiple failed login attempts' }, 403)
  }
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    // await incrementFailedAttempts(username)
    return c.json({ error: 'Invalid username or password' }, 401)
  }
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (expirationHours * 60 * 60);
  const token = await generateToken(JwtSecret, { username, iat: iat, exp: exp })
  setCookie(c, 'authToken', token, {
      httpOnly: false,
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24
    });
  return c.json({ token })
}

export const changePasswordHandler = async (c: Context) => {
  try {
    const { username, oldPassword, newPassword } = await c.req.json();

    if (!username || !oldPassword || !newPassword) {
      return c.json({ error: 'Username, old password, and new password are required' }, 400);
    }

    const user: any = await findUserByUsername(username);
    if (!user) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    const isValid = await verifyPassword(oldPassword, user.password);
    if (!isValid) {
      return c.json({ error: 'Invalid old password' }, 401);
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await updateUserPassword(username, hashedNewPassword);

    return c.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    return c.json({ error: error.message || 'Internal Server Error' }, 500);
  }
};  