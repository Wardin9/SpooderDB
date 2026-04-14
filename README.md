# SpooderDB - Database Studio

## Overview

A web-based PostgreSQL database studio built with TanStack Start, featuring compile-time SQL validation via sqlx-ts.

## Tech Stack

- **Frontend**: TanStack Start + shadcn/ui
- **Database**: PostgreSQL (user-configured via DATABASE_URL)
- **Type Safety**: sqlx-ts (compile-time SQL validation + type generation)
- **Runtime**: Node.js
- **Package Manager**: pnpm (recommended)

## Features

1. **Table Explorer** - Sidebar listing all tables, click to view `SELECT *`
2. **Query Editor** - Run custom SQL queries against the database
3. **Import** - Upload CSV/JSON files, preview data, confirm schema, auto-create table
4. **Export** - Download table or query results as CSV or JSON

## Project Structure

```
spooderdb/
├── src/
│   ├── routes/
│   │   ├── index.tsx           # Main studio UI
│   │   ├── _index.tsx          # Welcome/DB connection screen
│   │   └── api/
│   │       ├── query.ts        # Execute SQL queries
│   │       ├── tables.ts       # List tables, get schema
│   │       ├── import.ts       # CSV/JSON import
│   │       └── export.ts       # CSV/JSON export
│   ├── components/
│   │   ├── sidebar.tsx         # Table list
│   │   ├── table-view.tsx      # Table data grid
│   │   ├── query-editor.tsx    # SQL input + results
│   │   ├── data-grid.tsx       # Reusable tabular display
│   │   ├── import-dialog.tsx   # File upload + preview
│   │   └── export-dialog.tsx   # Format selection + download
│   └── lib/
│       ├── db.server.ts        # PostgreSQL connection (sqlx-ts)
│       ├── sql-queries/         # sqlx-ts SQL files
│       │   ├── tables.sql       # -- @name: getTables, -- @name: getTableSchema
│       │   ├── select.sql        # -- @name: selectAllFrom{Table}
│       │   └── execute.sql       # -- @name: runQuery
│       └── types.ts              # sqlx-ts generated types
├── .env.example
├── .sqlxrc.json                  # sqlx-ts config
└── package.json
```

## Setup

```bash
# Clone repo
git clone <repo-url>
cd spooderdb

# Install dependencies (pnpm recommended)
pnpm install

# Copy and configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Generate types from SQL queries
pnpm sqlx:generate

# Start development server
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgres://user:pass@localhost:5432/mydb`) |

## sqlx-ts Integration

SQL files in `src/lib/sql-queries/` use annotations:

```sql
-- @name: getUsers
SELECT * FROM users WHERE active = true;
```

Running `pnpm sqlx:generate` validates against DATABASE_URL and generates types in `src/lib/types.ts`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tables` | List all tables |
| GET | `/api/tables/:name` | Get table schema |
| GET | `/api/tables/:name/rows` | Paginated SELECT * |
| POST | `/api/query` | Execute custom SQL |
| POST | `/api/import` | Import CSV/JSON, create table |
| GET | `/api/export/:table` | Export as CSV or JSON |

## Development

```bash
# Run type generation (validates SQL against DB)
pnpm sqlx:generate

# Lint
pnpm lint

# Type check
pnpm typecheck

# Build for production
pnpm build
```
