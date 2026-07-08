import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function buildSupabaseDatabaseUrl() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const dbPassword =
    process.env.SUPABASE_DB_PASSWORD || process.env.POSTGRES_PASSWORD;

  if (!supabaseUrl || !dbPassword) return undefined;

  try {
    const { hostname } = new URL(supabaseUrl);
    const projectRef = hostname.split(".")[0];
    if (!projectRef) return undefined;

    return `postgresql://postgres:${encodeURIComponent(
      dbPassword
    )}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;
  } catch {
    return undefined;
  }
}

const databaseUrl = process.env.DATABASE_URL || buildSupabaseDatabaseUrl();

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. For Supabase deploy, set DATABASE_URL or set SUPABASE_URL plus SUPABASE_DB_PASSWORD."
  );
}

const needsSsl =
  databaseUrl.includes("supabase.co") ||
  databaseUrl.includes("sslmode=require") ||
  process.env.PGSSLMODE === "require";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: Number(process.env.DB_POOL_MAX || 10),
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
