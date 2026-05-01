# CLAUDE.md — Mini Library System

## Project Overview
Mini library management system: book inventory, member management, loan tracking.
Stack: Node.js + Express + TypeScript + SQLite (better-sqlite3) + Jest.

---

## Build Commands

```bash
# Install dependencies
cd partB && npm install

# Development (hot reload)
npm run dev

# Build TypeScript → JS
npm run build

# Run production build
npm start

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

---

## Project Conventions

### TypeScript
- Strict mode ON (`"strict": true` in tsconfig)
- No `any` types — use proper interfaces/types
- All functions must have explicit return types
- Use `interface` for object shapes, `type` for unions/aliases

### File Naming
- `camelCase.ts` for source files
- `*.test.ts` for test files
- `kebab-case` for route files (e.g., `book-routes.ts`)

### API Conventions
- RESTful endpoints: `/api/books`, `/api/members`, `/api/loans`
- All responses: `{ success: boolean, data?: T, error?: string }`
- HTTP status codes must be meaningful (200, 201, 400, 404, 409, 500)
- Validation errors return 400 with field-level messages

### Git Commits
- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
- AI-assisted commits must include: `Co-Authored-By: Claude <noreply@anthropic.com>`

### Database
- SQLite file: `partB/library.db`
- Migrations in: `partB/src/db/migrations/`
- Never raw SQL in route handlers — use repository pattern

---

## No-Go Zones
- Do NOT use `eval()` or `Function()` constructor
- Do NOT store passwords in plain text
- Do NOT expose stack traces in production API responses
- Do NOT use `SELECT *` — always name columns explicitly
- Do NOT skip input validation on any endpoint
- Do NOT commit `library.db` or `node_modules/` or `.env` files
- Do NOT use `require()` — ES modules / TypeScript imports only
- Do NOT write tests that depend on test execution order

---

## Architecture Summary
```
Client (HTTP) → Express Router → Controller → Repository → SQLite DB
```
- **Routes**: HTTP method + path mapping
- **Controllers**: Request parsing, response formatting
- **Repository**: All DB queries (no SQL in controllers)
- **Models**: TypeScript interfaces for data shapes
- **Middleware**: Auth check, error handler, request logger

---

## Environment Variables (.env)
```
PORT=3000
NODE_ENV=development
DB_PATH=./library.db
```