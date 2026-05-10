import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Direct env access is safer for CLI execution to avoid tsx module resolution issues
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;