import { pgTable, uuid, varchar, text, jsonb, timestamp, check, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
//  (The Transaction Story)
// This table describes WHAT happened and WHEN.
export const journalEntries = pgTable('journal_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: varchar('reference', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('posted'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('chk_journal_status', sql`${table.status} IN ('posted', 'reversed')`),
  uniqueIndex('idx_journal_reference').on(table.reference),
]);