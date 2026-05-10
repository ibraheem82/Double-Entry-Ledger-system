import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Extend Express Request type safely
declare module 'express' {
  interface Request {
    requestId: string;
  }
}

/**
 * Attaches a unique request ID to every incoming request.
 * Uses client-provided `x-request-id` if present, otherwise generates a new UUID.
 * Critical for distributed tracing and log correlation.
 */
export const requestIdMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const provided = req.headers['x-request-id'];
  req.requestId = typeof provided === 'string' ? provided : uuidv4();
  next();
};