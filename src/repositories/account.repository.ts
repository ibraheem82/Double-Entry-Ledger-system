import { db } from '../config/database';
import { accounts } from '../db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { AccountEntity, AccountType, NormalBalance } from '../types/account.types';
import { AccountNotFoundError, DuplicateAccountCodeError } from '../errors/domain.errors';

export const AccountRepository = {
  async create(data: { code: string; name: string; type: AccountType; normalBalance: NormalBalance; currency: string; isSystem: boolean; description?: string }): Promise<AccountEntity> {
    try {
      const [newAccount] = await db
        .insert(accounts)
        .values(data)
        .returning();
      return newAccount as AccountEntity;
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        throw new DuplicateAccountCodeError(data.code);
      }
      throw error;
    }
  },

  async getById(id: string): Promise<AccountEntity | null> {
    const result = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
    return (result[0] as AccountEntity) || null;
  },

  async getByCode(code: string): Promise<AccountEntity | null> {
    const result = await db.select().from(accounts).where(eq(accounts.code, code)).limit(1);
    return (result[0] as AccountEntity) || null;
  },

  async listAll(page: number, limit: number): Promise<{ data: AccountEntity[]; total: number }> {
    const offset = (page - 1) * limit;
    const [dataResult, countResult] = await Promise.all([
      db.select().from(accounts).orderBy(asc(accounts.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(accounts),
    ]);
    return {
      data: dataResult as AccountEntity[],
      total: countResult[0].count,
    };
  },

  // Throws if account not found; ensures we never operate on ghosts
  async getByIdOrThrow(id: string): Promise<AccountEntity> {
    const account = await this.getById(id);
    if (!account) throw new AccountNotFoundError(id);
    return account;
  },
};