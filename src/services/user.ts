
import { db } from "./db/db.js";
export const createUser = async (username: string, password: string) => {
    const user = await db.run(`
      INSERT INTO users (username, password)
      SELECT ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM users);
    `, [username, password])
    return user
}

export const findUserByUsername = async (username: string) => {
  const user = await db
    .query("SELECT * FROM users WHERE username = $username")
    .get({ $username: username });
  return user;

};
export const userExists = async () => {
     const user = await db
    .query("SELECT username FROM users LIMIT 1")
    .get();
  return user;
};
export const updateUserPassword = async (username: string, newPassword: string) => {
    return await db.run('UPDATE users SET password = ? WHERE username = ?', [newPassword, username])
};

export const deleteUser = async (username: string) => {
    return await db.run('DELETE FROM users WHERE username = ?', [username]
    )
};