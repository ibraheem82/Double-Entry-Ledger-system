import { Request, Response } from 'express';
import { ledgerService } from '../services/ledger.service';
import { ApiSuccessEnvelope } from '../types/api.types';
import { formatMoneyForResponse } from '../utils/money';

export class HealthController {
  static async health(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  }

  static async trialBalance(req: Request, res: Response): Promise<void> {
    const trialBalance = await ledgerService.getTrialBalance();
    
    const response: ApiSuccessEnvelope<{ debitTotal: string; creditTotal: string; balanced: boolean }> = {
      success: true,
      data: {
        debitTotal: formatMoneyForResponse(BigInt(trialBalance.debitTotal)).amount,
        creditTotal: formatMoneyForResponse(BigInt(trialBalance.creditTotal)).amount,
        balanced: trialBalance.balanced,
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(200).json(response);
  }
}