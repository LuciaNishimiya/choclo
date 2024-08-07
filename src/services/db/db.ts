import { Database } from "bun:sqlite";
import { initSchema } from "./schema.js";

export const db = new Database("./database.db"); 

initSchema()