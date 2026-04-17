import { createServerFn } from "@tanstack/react-start"
import { getTables, getTableRows, getTableSchema } from "./db.server"

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
