import { env } from "@/env/server"
import pg, { type QueryResultRow } from "pg"

const DESTRUCTIVE_KEYWORDS = [
  "drop",
  "truncate",
  "delete",
  "alter",
  "create",
  "insert",
  "update",
  "grant",
  "revoke",
  "begin",
  "commit",
  "rollback",
]

export function isDestructiveQuery(sql: string): boolean {
  const normalized = sql.toLowerCase().trim()
  return DESTRUCTIVE_KEYWORDS.some((keyword) => normalized.startsWith(keyword))
}

export function sanitizeTableName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, "")
}

let pool: pg.Pool | null = null

function getPool(): pg.Pool {
  if (!pool) {
    if (!env.DB_URL) {
      throw new Error("DB_URL environment variable is not set")
    }
    pool = new pg.Pool({
      connectionString: env.DB_URL,
    })
  }
  return pool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  const client = await getPool().connect()
  try {
    return await client.query<T>(text, params)
  } finally {
    client.release()
  }
}

export async function getTables(): Promise<string[]> {
  const result = await query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  )
  return result.rows
    .map((r) => r.table_name)
    .filter((t) => !t.startsWith("pg_"))
}

export async function getTableRows(
  tableName: string,
  limit = 100,
  offset = 0
): Promise<QueryResultRow[]> {
  const result = await query(`SELECT * FROM ${tableName} LIMIT $1 OFFSET $2`, [
    limit,
    offset,
  ])
  return result.rows
}

export async function getTableSchema(
  tableName: string
): Promise<QueryResultRow[]> {
  const result = await query(
    `SELECT column_name, data_type, is_nullable, column_default 
     FROM information_schema.columns 
     WHERE table_name = $1 AND table_schema = 'public' 
     ORDER BY ordinal_position`,
    [tableName]
  )
  return result.rows
}

export interface ExecuteQueryResult {
  rows: QueryResultRow[]
  rowCount: number
  command: string
}

export async function executeQuery(sql: string): Promise<ExecuteQueryResult> {
  const result = await query(sql)
  return {
    rows: result.rows,
    rowCount: result.rowCount ?? 0,
    command: result.command,
  }
}
