import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as baseSchema from "@/drizzle/schema";
import * as messageSchema from "@/drizzle/messages";

const globalForDb = globalThis as unknown as { conn: postgres.Sql };

const conn =
  globalForDb.conn ||
  postgres(process.env.DATABASE_URL || "", {
    max: 1,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

const schema = { ...baseSchema, ...messageSchema };

export const db = drizzle(conn, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export type Database = typeof db;
