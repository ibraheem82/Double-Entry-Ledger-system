import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from './env';
import * as schema from '../db/schema';

// Connection Pool: Manages efficient DB connections
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Drizzle ORM instance with full schema awareness
export const db = drizzle(pool, { schema });