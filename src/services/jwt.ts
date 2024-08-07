import { db } from "./db/db.js";
import crypto from 'crypto';

export function generateSecret() {
  return crypto.randomBytes(64).toString('hex');
}

let secret: any;
export const getSecret = async () => {
  try{
if (secret) return secret.secret;
    const JwtSecret = await db.query('SELECT secret FROM jwt_secret LIMIT 1',).all();
    secret = JwtSecret[0];
    return secret.secret
  } catch{}
}  