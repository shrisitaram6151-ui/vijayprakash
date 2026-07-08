import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createPool() {
  if (!databaseUrl) {
    return new Pool({ connectionString: "postgresql://localhost:5432/dummy" });
  }

  // Remove sslmode from URL — we handle SSL in code
  const cleanUrl = databaseUrl.replace(/[?&]sslmode=[^&]*/gi, "");

  const isRemote =
    databaseUrl.includes("supabase.com") ||
    databaseUrl.includes("neon.tech") ||
    !databaseUrl.includes("localhost");

  return new Pool({
    connectionString: cleanUrl,
    max: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  });
}

export const pool = globalForDb.__arenaNextJsPostgresqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
