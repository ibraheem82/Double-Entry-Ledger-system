import { Router, IRouter } from 'express';
import { HealthController } from '../controllers/health.controller';
import { asyncHandler } from '../utils/async-handler';

export const healthRouter: IRouter = Router();

// GET /health
healthRouter.get('/', asyncHandler(HealthController.health));

// GET /trial-balance
healthRouter.get('/trial-balance', asyncHandler(HealthController.trialBalance));

export default healthRouter;