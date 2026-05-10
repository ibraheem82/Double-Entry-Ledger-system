import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../errors/http.errors';

/**
 * Factory function that returns Express middleware.
 * Validates `req.body` against a Zod schema. If invalid, throws BadRequestError.
 * If valid, replaces `req.body` with the parsed/transformed output.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Format Zod errors into a developer-friendly string
      const formattedErrors = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      throw new BadRequestError(`Validation failed: ${formattedErrors}`);
    }
    req.body = result.data;
    next();
  };
};