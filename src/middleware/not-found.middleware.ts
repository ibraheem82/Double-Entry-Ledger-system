import { Request, Response } from 'express';
import { ApiErrorEnvelope } from '../types/api.types';

/**
 * Catches all requests that reach the end of the route stack without a match.
 * Returns a standardized 404 JSON response.
 */
export const notFoundMiddleware = (req: Request, res: Response) => {
  const response: ApiErrorEnvelope = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
    meta: {
      requestId: req.requestId || 'unknown',
      timestamp: new Date().toISOString(),
    },
  };
  res.status(404).json(response);
};