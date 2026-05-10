import { Router, IRouter } from 'express';
import { validate } from '../middleware/validate.middleware';
import { postTransactionSchema } from '../validators/ledger.validators';
import { LedgerController } from '../controllers/ledger.controller';
import { asyncHandler } from '../utils/async-handler';

export const ledgerRouter: IRouter = Router();

/**
 * @openapi
 * /api/v1/transactions:
 *   post:
 *     summary: Post a new double-entry journal transaction
 *     tags: [Ledger]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reference, description, lines]
 *             properties:
 *               reference: { type: string, example: "txn_001" }
 *               description: { type: string }
 *               metadata: { type: object }
 *               lines:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   required: [accountId, direction, amount, currency]
 *                   properties:
 *                     accountId: { type: string, format: uuid }
 *                     direction: { type: string, enum: [debit, credit] }
 *                     amount: { type: string, example: "10000.00" }
 *                     currency: { type: string, example: "NGN" }
 *     responses:
 *       201: { description: Transaction posted successfully }
 *       422: { description: Unbalanced or invalid transaction }
 *       409: { description: Duplicate reference or already reversed }
 */
ledgerRouter.post('/', validate(postTransactionSchema), asyncHandler(LedgerController.postTransaction));

/**
 * @openapi
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get journal entry by ID
 *     tags: [Ledger]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Journal entry details }
 *       404: { description: Not found }
 */
ledgerRouter.get('/:id', asyncHandler(LedgerController.getTransaction));

/**
 * @openapi
 * /api/v1/transactions/{id}/reverse:
 *   post:
 *     summary: Reverse a posted transaction
 *     tags: [Ledger]
 *     parameters:
 *       - in: path, name: id, required: true, schema: { type: string, format: uuid }
 *     responses:
 *       201: { description: Reversal entry created }
 *       409: { description: Already reversed }
 */
ledgerRouter.post('/:id/reverse', asyncHandler(LedgerController.reverseTransaction));