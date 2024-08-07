import { db } from "./db/db.js";

const maxAttempts = 5

export const incrementFailedAttempts = async (username: string) => {
    await db.run('UPDATE users SET attempts = attempts + 1 WHERE username = ?', [username]);
}

export const resetFailedAttempts = async (username: string) => {
    await db.run('UPDATE users SET attempts = 0 WHERE username = ?', [username]);
}

export const isAccountLocked = async (user: any) => {
    const attempts = user.attempts
    return attempts >= maxAttempts
} 