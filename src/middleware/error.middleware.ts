import { Request, Response, NextFunction } from 'express';
import { BaseDomainError } from '../errors/domain.errors';
import { BadRequestError, UnauthorizedError, ForbiddenError, InternalServerError } from '../errors/http.errors';
import { ApiErrorEnvelope } from '../types/api.types';
import { logger } from '../utils/logger';

/**
 * Global Express error handler. Maps all typed errors to consistent JSON envelopes.
 * MUST be registered AFTER all routes.
 */
export const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  let httpStatus = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal error occurred. Please try again later.';
  let details: Record<string, unknown> | undefined;

  if (err instanceof BaseDomainError) {
    httpStatus = err.httpStatus;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof InternalServerError
  ) {
    httpStatus = err.statusCode;
    code = err.name.replace('Error', '').toUpperCase();
    message = err.message;
  }

  // Log appropriately based on severity
  if (httpStatus >= 500) {
    logger.error('Unhandled Error', {
      code,
      message: err.message,
      stack: err.stack,
      requestId: req.requestId,
    });
  } else {
    logger.warn('Client Error Handled', {
      code,
      message,
      requestId: req.requestId,
    });
  }

  const response: ApiErrorEnvelope = {
    success: false,
    error: { code, message, details },
    meta: {
      requestId: req.requestId || 'unknown',
      timestamp: new Date().toISOString(),
    },
  };

  res.status(httpStatus).json(response);
};