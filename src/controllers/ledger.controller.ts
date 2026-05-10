import { Request, Response } from 'express';
import { ledgerService } from '../services/ledger.service';
import { ApiSuccessEnvelope } from '../types/api.types';

export class LedgerController {
  static async postTransaction(req: Request, res: Response): Promise<void> {
    const entry = await ledgerService.postTransaction(req.body);
    const response: ApiSuccessEnvelope<typeof entry> = {
      success: true,
      data: entry,
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(201).json(response);
  }

  static async getTransaction(req: Request, res: Response): Promise<void> {
    const entry = await ledgerService.getJournalEntry(req.params.id as string);
    if (!entry) {
      res.status(404).json({
        success: false,
        error: { code: 'TRANSACTION_NOT_FOUND', message: 'Journal entry not found' },
        meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
      });
      return;
    }

    const response: ApiSuccessEnvelope<typeof entry> = {
      success: true,
      data: entry,
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(200).json(response);
  }

  static async reverseTransaction(req: Request, res: Response): Promise<void> {
    const entry = await ledgerService.reverseTransaction(req.params.id as string);
    const response: ApiSuccessEnvelope<typeof entry> = {
      success: true,
      data: entry,
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(201).json(response);
  }
}