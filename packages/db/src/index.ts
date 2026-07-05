import { neon } from "@neondatabase/serverless";
import { env } from "@portfolio/env/server";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.DATABASE_URL || "");
export const db = drizzle(sql);
