import { Router, IRouter } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createAccountSchema } from '../validators/account.validators';
import { AccountController } from '../controllers/account.controller';
import { asyncHandler } from '../utils/async-handler';

export const accountRouter: IRouter = Router();

/**
 * @openapi
 * /api/v1/accounts:
 *   post:
 *     summary: Create a new ledger account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, type, normalBalance, currency]
 *             properties:
 *               code: { type: string, example: "usr_wallet:123" }
 *               name: { type: string, example: "User Wallet" }
 *               type: { type: string, enum: [asset, liability, equity, revenue, expense] }
 *               normalBalance: { type: string, enum: [debit, credit] }
 *               currency: { type: string, example: "NGN" }
 *               description: { type: string }
 *     responses:
 *       201: { description: Account created successfully }
 *       409: { description: Duplicate account code }
 *       400: { description: Validation error }
 */
accountRouter.post('/', validate(createAccountSchema), asyncHandler(AccountController.create));

/**
 * @openapi
 * /api/v1/accounts:
 *   get:
 *     summary: List all accounts
 *     tags: [Accounts]
 *     parameters:
 *       - in: query, name: page, schema: { type: integer, default: 1 }
 *       - in: query, name: limit, schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list of accounts }
 */
accountRouter.get('/', asyncHandler(AccountController.list));

/**
 * @openapi
 * /api/v1/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Account details }
 *       404: { description: Account not found }
 */
accountRouter.get('/:id', asyncHandler(AccountController.getById));

/**
 * @openapi
 * /api/v1/accounts/{id}/balance:
 *   get:
 *     summary: Get account balance
 *     tags: [Accounts]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: string, format: uuid }
 *       - in: query, name: asOf, schema: { type: string, format: date-time }
 *     responses:
 *       200: { description: Current or historical balance }
 */
accountRouter.get('/:id/balance', asyncHandler(AccountController.getBalance));