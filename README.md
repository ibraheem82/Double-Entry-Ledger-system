# Double-Entry Ledger System

A production-grade, append-only double-entry bookkeeping API built for fintech applications. Guarantees atomic transactions, strict audit trails, and historical balance accuracy.

## 🚀 Prerequisites
- Node.js v20+ (LTS)
- PostgreSQL 15+
- npm v9+

## 🛠️ Local Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill `DATABASE_URL` & `CORS_ORIGIN`
3. `npx drizzle-kit migrate` (runs pending migrations)
4. `npm run db:seed` (creates required system accounts)
5. `npm run dev` (starts server at `http://localhost:3000`)
6. View docs: `http://localhost:3000/api/docs`

## 📜 Architecture
- **Append-Only**: No updates/deletes on financial records. Corrections use reversal entries.
- **BigInt Money**: All amounts stored as `bigint` (kobo/cents). Zero floating-point arithmetic.
- **Row Locking**: `SELECT ... FOR UPDATE` prevents race conditions during concurrent writes.
- **Strict Layers**: Controllers → Services → Repositories → DB. No cross-layer leakage.
- **Typed Errors**: Every failure maps to a machine-readable `error.code` for frontend handling.

## 🧪 Testing
- Unit: `npm test`
- Integration: `npm test` (requires running Postgres)

## ⚠️ Troubleshooting
- `ECONNREFUSED`: Check PostgreSQL is running and `DATABASE_URL` is correct.
- `tsc` errors: Run `npm install` and verify strict mode config matches.