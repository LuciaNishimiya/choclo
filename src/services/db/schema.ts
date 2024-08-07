import { generateSecret } from "../jwt.js";
import { db } from "./db.js";

export async function initSchema() {
  const secret = generateSecret();
    await db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      attempts INTEGER DEFAULT 0
    );`);
    await db.run(`CREATE TABLE IF NOT EXISTS jwt_secret (
      secret TEXT NOT NULL UNIQUE
    );`);
    await db.run(`INSERT INTO jwt_secret (secret)
     SELECT ?
     WHERE NOT EXISTS (SELECT 1 FROM jwt_secret);`, [secret]);
  } 