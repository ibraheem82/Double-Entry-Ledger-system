import { db } from '../config/database';
import { accounts } from './schema';
import { logger } from '../utils/logger';

const SYSTEM_ACCOUNTS = [
  { code: 'asset:bank_float', name: 'Bank Float', type: 'asset', normalBalance: 'debit', currency: 'NGN', isSystem: true, description: 'Represents real money held in the platform bank account' },
  { code: 'liability:user_wallets', name: 'User Wallets Aggregate', type: 'liability', normalBalance: 'credit', currency: 'NGN', isSystem: true, description: 'Aggregate liability for all user wallet balances' },
  { code: 'revenue:transfer_fees', name: 'Transfer Fee Revenue', type: 'revenue', normalBalance: 'credit', currency: 'NGN', isSystem: true, description: 'Revenue from transfer fees' },
  { code: 'revenue:withdrawal_fees', name: 'Withdrawal Fee Revenue', type: 'revenue', normalBalance: 'credit', currency: 'NGN', isSystem: true, description: 'Revenue from withdrawal fees' },
  { code: 'expense:bank_charges', name: 'Bank Charges', type: 'expense', normalBalance: 'debit', currency: 'NGN', isSystem: true, description: 'Banking partner charges' },
  { code: 'suspense:pending', name: 'Suspense Account', type: 'liability', normalBalance: 'credit', currency: 'NGN', isSystem: true, description: 'Temporary holding for in-flight transactions' },
];

async function seed() {
  try {
    logger.info('🌱 Seeding system accounts...');
    await db.insert(accounts).values(SYSTEM_ACCOUNTS).onConflictDoNothing();
    logger.info('✅ System accounts seeded successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();