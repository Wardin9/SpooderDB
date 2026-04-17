import { createServerFn } from "@tanstack/react-start"
import {
  executeQuery,
  getTableRows,
  getTableSchema,
  getTables,
  isDestructiveQuery,
  type ExecuteQueryResult,
} from "./db.server"

export const getTablesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return await getTables()
  }
)

export const getTableRowsFn = createServerFn({ method: "GET" })
  .inputValidator(
    (data: { tableName: string; limit?: number; offset?: number }) => data
  )
  .handler(async ({ data }) => {
    return await getTableRows(
      data.tableName,
      data.limit ?? 100,
      data.offset ?? 0
    )
  })

export const getTableSchemaFn = createServerFn({ method: "GET" })
  .inputValidator((data: { tableName: string }) => data)
  .handler(async ({ data }) => {
    return await getTableSchema(data.tableName)
  })

export const executeQueryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { sql: string; allowDestructive?: boolean }) => data)
  .handler(async ({ data }): Promise<ExecuteQueryResult> => {
    if (data.allowDestructive !== true && isDestructiveQuery(data.sql)) {
      throw new Error(
        "Destructive queries are not allowed. Toggle the switch to allow."
      )
    }
    return await executeQuery(data.sql)
  })

export const checkDestructiveQueryFn = createServerFn({ method: "POST" })
  .inputValidator((data: { sql: string }) => data)
  .handler(async ({ data }) => {
    return { isDestructive: isDestructiveQuery(data.sql) }
  })
