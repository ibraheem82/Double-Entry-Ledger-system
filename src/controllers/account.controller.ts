import { Request, Response } from 'express';
import { accountService } from '../services/account.service';
import { ApiSuccessEnvelope } from '../types/api.types';

export class AccountController {
  static async create(req: Request, res: Response): Promise<void> {
    const account = await accountService.create(req.body);
    const response: ApiSuccessEnvelope<typeof account> = {
      success: true,
      data: account,
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(201).json(response);
  }

  static async list(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { data, total } = await accountService.listAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    const response: ApiSuccessEnvelope<typeof data> = {
      success: true,
      data,
      meta: {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        pagination: { page, limit, total, totalPages },
      },
    };
    res.status(200).json(response);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const account = await accountService.getById(req.params.id as string);
    const response: ApiSuccessEnvelope<typeof account> = {
      success: true,
      data: account,
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(200).json(response);
  }

  static async getBalance(req: Request, res: Response): Promise<void> {
    const asOf = req.query.asOf ? new Date(req.query.asOf as string) : undefined;
    const { account, balanceKobo, balanceDisplay } = await accountService.getBalance(req.params.id as string, asOf);
    
    const response: ApiSuccessEnvelope<{ id: string; code: string; name: string; type: string; normalBalance: string; currency: string; isSystem: boolean; balanceKobo: number; balanceDisplay: string }> = {
      success: true,
      data: {
        id: account.id, code: account.code, name: account.name, type: account.type,
        normalBalance: account.normalBalance, currency: account.currency, isSystem: account.isSystem,
        balanceKobo: Number(balanceKobo), balanceDisplay,
      },
      meta: { requestId: req.requestId, timestamp: new Date().toISOString() },
    };
    res.status(200).json(response);
  }
}