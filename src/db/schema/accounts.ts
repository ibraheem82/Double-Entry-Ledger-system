import { pgTable, uuid, varchar, boolean, text, timestamp, check, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  normalBalance: varchar('normal_balance', { length: 10 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('NGN'),
  isSystem: boolean('is_system').notNull().default(false),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('chk_account_type', sql`${table.type} IN ('asset', 'liability', 'equity', 'revenue', 'expense')`),
  check('chk_account_normal_balance', sql`${table.normalBalance} IN ('debit', 'credit')`),
  check('chk_account_currency', sql`${table.currency} ~ '^[A-Z]{3}$'`),
  uniqueIndex('idx_accounts_code').on(table.code),
]);