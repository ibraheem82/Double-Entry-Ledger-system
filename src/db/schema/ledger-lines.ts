import { pgTable, uuid, varchar, bigint, timestamp, check, index } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { journalEntries } from './journal-entries';
import { accounts } from './accounts';

export const ledgerLines = pgTable('ledger_lines', {
  id: uuid('id').primaryKey().defaultRandom(),
  journalEntryId: uuid('journal_entry_id').notNull().references(() => journalEntries.id, { onDelete: 'restrict' }),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'restrict' }),
  direction: varchar('direction', { length: 6 }).notNull(),
  amount: bigint('amount', { mode: 'bigint' }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('NGN'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check('chk_line_direction', sql`${table.direction} IN ('debit', 'credit')`),
  check('chk_line_amount_positive', sql`${table.amount} > 0`),
  check('chk_line_currency', sql`${table.currency} ~ '^[A-Z]{3}$'`),
  index('idx_lines_account_id').on(table.accountId),
  index('idx_lines_journal_entry_id').on(table.journalEntryId),
  index('idx_lines_account_created_desc').on(table.accountId, table.createdAt.desc()),
]);

export const journalEntriesRelations = relations(journalEntries, ({ many }) => ({
  lines: many(ledgerLines),
}));

export const ledgerLinesRelations = relations(ledgerLines, ({ one }) => ({
  journalEntry: one(journalEntries, {
    fields: [ledgerLines.journalEntryId],
    references: [journalEntries.id],
  }),
  account: one(accounts, {
    fields: [ledgerLines.accountId],
    references: [accounts.id],
  }),
}));