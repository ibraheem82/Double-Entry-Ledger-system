# Architecture Guide

## Layer Boundaries
1. **Routes**: HTTP paths, Swagger JSDoc, validation middleware attachment.
2. **Controllers**: Request/Response parsing, envelope formatting, status codes.
3. **Services**: Business rules, transaction posting algorithm, balance calculation, domain errors.
4. **Repositories**: Drizzle ORM queries, connection management, DB-level constraints.
5. **Middleware**: Global error mapping, request tracing, CORS, security headers.

## Financial Guarantees
- **Atomicity**: `db.transaction()` wraps all writes. Partial failures roll back.
- **Idempotency**: Duplicate `reference` keys return existing entries safely.
- **Deadlock Prevention**: Account IDs are sorted before `SELECT ... FOR UPDATE`.
- **Audit Trail**: Every change is an append. `status: reversed` marks corrections.

## Adding New Features
1. Define schema in `src/db/schema/`
2. Run `npx drizzle-kit generate` & `migrate`
3. Add types to `src/types/`
4. Implement repo methods in `src/repositories/`
5. Add business logic to `src/services/`
6. Wire controller & route with Swagger JSDoc