import { DomainErrorPayload } from '../types/errors.types';

export class BaseDomainError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly details?: Record<string, unknown>;

  constructor(payload: DomainErrorPayload) {
    super(payload.message);
    this.code = payload.code;
    this.httpStatus = payload.httpStatus;
    this.details = payload.details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AccountNotFoundError extends BaseDomainError {
  constructor(accountId: string, details?: Record<string, unknown>) {
    super({ code: 'ACCOUNT_NOT_FOUND', message: `Account "${accountId}" not found.`, httpStatus: 404, details });
  }
}

export class DuplicateAccountCodeError extends BaseDomainError {
  constructor(code: string, details?: Record<string, unknown>) {
    super({ code: 'DUPLICATE_ACCOUNT_CODE', message: `Account code "${code}" already exists.`, httpStatus: 409, details });
  }
}

export class InsufficientFundsError extends BaseDomainError {
  constructor(accountId: string, required: bigint, available: bigint, details?: Record<string, unknown>) {
    super({
      code: 'INSUFFICIENT_FUNDS',
      message: `Insufficient funds in account "${accountId}". Required: ${required.toString()}, Available: ${available.toString()}.`,
      httpStatus: 422,
      details: { ...details, required: required.toString(), available: available.toString() },
    });
  }
}

export class UnbalancedTransactionError extends BaseDomainError {
  constructor(totalDebits: bigint, totalCredits: bigint, details?: Record<string, unknown>) {
    super({
      code: 'UNBALANCED_TRANSACTION',
      message: `Transaction is unbalanced. Debits: ${totalDebits.toString()}, Credits: ${totalCredits.toString()}.`,
      httpStatus: 422,
      details: { ...details, totalDebits: totalDebits.toString(), totalCredits: totalCredits.toString() },
    });
  }
}

export class DuplicateReferenceError extends BaseDomainError {
  constructor(reference: string, details?: Record<string, unknown>) {
    super({ code: 'DUPLICATE_REFERENCE', message: `Reference "${reference}" already exists.`, httpStatus: 409, details });
  }
}

export class InvalidTransactionError extends BaseDomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({ code: 'INVALID_TRANSACTION', message, httpStatus: 422, details });
  }
}

export class AccountIsSystemError extends BaseDomainError {
  constructor(accountId: string, details?: Record<string, unknown>) {
    super({ code: 'ACCOUNT_IS_SYSTEM', message: `System account "${accountId}" cannot be modified.`, httpStatus: 403, details });
  }
}

export class CurrencyMismatchError extends BaseDomainError {
  constructor(expected: string, received: string, details?: Record<string, unknown>) {
    super({ code: 'CURRENCY_MISMATCH', message: `Expected currency ${expected}, got ${received}.`, httpStatus: 422, details });
  }
}

export class TransactionAlreadyReversedError extends BaseDomainError {
  constructor(transactionId: string, details?: Record<string, unknown>) {
    super({ code: 'TRANSACTION_ALREADY_REVERSED', message: `Transaction "${transactionId}" already reversed.`, httpStatus: 409, details });
  }
}