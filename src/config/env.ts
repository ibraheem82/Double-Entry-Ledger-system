import { z } from 'zod';

// No need for dotenv — Node.js loads .env via the --env-file flag

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),
  CORS_ORIGIN: z.string().url('CORS_ORIGIN must be a valid URL'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(envParse.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = envParse.data;