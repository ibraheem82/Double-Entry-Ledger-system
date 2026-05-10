import { Router, IRouter } from 'express';
import { accountRouter } from './account.routes';
import { ledgerRouter } from './ledger.routes';
import healthRouter from './health.routes';

const v1Router: IRouter = Router();

v1Router.use('/accounts', accountRouter);
v1Router.use('/transactions', ledgerRouter);
v1Router.use('/', healthRouter);

export default v1Router;