import { db } from '../config/database';
import { journalEntries, ledgerLines, accounts } from '../db/schema';
import { eq, and, lte, desc, sum, count, sql, asc, inArray } from 'drizzle-orm';
import { JournalEntryEntity, LedgerLineEntity } from '../types/ledger.types';
import { TransactionAlreadyReversedError } from '../errors/domain.errors';

type Tx = typeof db;

export const LedgerRepository = {
  /**
   * CRITICAL: Locks accounts in sorted order to prevent deadlocks.
   * Must be called INSIDE a transaction.
   */
  async lockAccounts(tx: Tx, accountIds: string[]): Promise<void> {
    if (accountIds.length === 0) return;
    const sortedIds = [...accountIds].sort();
    await tx.select().from(accounts).where(inArray(accounts.id, sortedIds)).for('update');
  },

  /**
   * Idempotency Check: Returns existing entry if reference matches.
   */
  async findByReference(tx: Tx, reference: string): Promise<JournalEntryEntity | null> {
    const result = await tx.select().from(journalEntries).where(eq(journalEntries.reference, reference)).limit(1);
    return (result[0] as JournalEntryEntity) || null;
  },

  async createJournalEntry(tx: Tx, data: { reference: string; description: string; metadata?: Record<string, unknown> }): Promise<JournalEntryEntity> {
    const [entry] = await tx.insert(journalEntries).values(data).returning();
    return entry as JournalEntryEntity;
  },

  async createLedgerLines(tx: Tx, lines: { journalEntryId: string; accountId: string; direction: string; amount: bigint; currency: string }[]): Promise<void> {
    await tx.insert(ledgerLines).values(lines);
  },

  /**
   * Fetches all historical lines for an account, optionally filtered by date.
   * Used by AccountService.getBalance() to compute running balance.
   */
  async getAccountBalanceLines(accountId: string, asOf?: Date): Promise<LedgerLineEntity[]> {
    const condition = asOf ? lte(ledgerLines.createdAt, asOf) : sql`true`;
    const result = await db.select()
      .from(ledgerLines)
      .where(and(eq(ledgerLines.accountId, accountId), condition))
      .orderBy(asc(ledgerLines.createdAt));
    return result as LedgerLineEntity[];
  },

  async getJournalEntryById(id: string): Promise<JournalEntryEntity | null> {
    const entries = await db.select().from(journalEntries).where(eq(journalEntries.id, id)).limit(1);
    if (entries.length === 0) return null;

    const lines = await db.select().from(ledgerLines).where(eq(ledgerLines.journalEntryId, id));
    return { ...entries[0], lines: lines as LedgerLineEntity[] } as JournalEntryEntity;
  },

  async getAccountHistory(accountId: string, page: number, limit: number, asOfDate?: Date): Promise<{ data: LedgerLineEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const dateFilter = asOfDate ? lte(ledgerLines.createdAt, asOfDate) : sql`1=1`;
    
    const [lines, totalResult] = await Promise.all([
      db.select().from(ledgerLines).where(and(eq(ledgerLines.accountId, accountId), dateFilter)).orderBy(desc(ledgerLines.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(ledgerLines).where(and(eq(ledgerLines.accountId, accountId), dateFilter)),
    ]);

    return { data: lines as LedgerLineEntity[], total: totalResult[0].count };
  },

  async getTrialBalance(): Promise<{ debitTotal: bigint; creditTotal: bigint; balanced: boolean }> {
    // PostgreSQL returns bigint sums as strings to prevent JS number overflow
    const result = await db.select({
      direction: ledgerLines.direction,
      total: sum(ledgerLines.amount).mapWith((v) => (v ? BigInt(v) : 0n)),
    }).from(ledgerLines).groupBy(ledgerLines.direction);

    const debitTotal = result.find(r => r.direction === 'debit')?.total || 0n;
    const creditTotal = result.find(r => r.direction === 'credit')?.total || 0n;
    return { debitTotal, creditTotal, balanced: debitTotal === creditTotal };
  },

  async reverseTransaction(tx: Tx, entryId: string): Promise<void> {
    // Check status
    const entry = await tx.select().from(journalEntries).where(eq(journalEntries.id, entryId)).limit(1);
    if ((entry[0]?.status as any) === 'reversed') {
      throw new TransactionAlreadyReversedError(entryId);
    }

    // Update status
    await tx.update(journalEntries).set({ status: 'reversed' }).where(eq(journalEntries.id, entryId));
  }
};