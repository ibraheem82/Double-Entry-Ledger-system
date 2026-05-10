import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { RequestHandler } from 'express';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Double-Entry Ledger System API',
      version: '1.0.0',
      description: 'A production-grade double-entry bookkeeping API for fintech applications. Handles atomic transactions, idempotency, and strict audit trails.',
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: 'Local Development' },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'UNBALANCED_TRANSACTION' },
                message: { type: 'string' },
                details: { type: 'object' }
              }
            },
            meta: {
              type: 'object',
              properties: { requestId: { type: 'string' }, timestamp: { type: 'string' } }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // JSDoc paths for route definitions
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerUiServe: RequestHandler[] = swaggerUi.serve;
export const swaggerUiSetup: RequestHandler = swaggerUi.setup(swaggerSpec);