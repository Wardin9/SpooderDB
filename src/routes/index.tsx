import { createFileRoute } from "@tanstack/react-router"
import { ChevronRight, Database, LayoutGrid, Play, Table } from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  getTableRowsFn,
  getTableSchemaFn,
  getTablesFn,
  executeQueryFn,
  checkDestructiveQueryFn,
} from "@/lib/db.functions"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const tables = await getTablesFn()
    return { tables }
  },
})

function App() {
  const { tables } = Route.useLoaderData()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableRows, setTableRows] = useState<unknown[]>([])
  const [tableSchema, setTableSchema] = useState<unknown[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [queryError, setQueryError] = useState<string | null>(null)

  const handleTableClick = async (tableName: string) => {
    setSelectedTable(tableName)
    setIsLoading(true)
    try {
      const rows = await getTableRowsFn({
        data: { tableName, limit: 100, offset: 0 },
      })
      const schema = await getTableSchemaFn({ data: { tableName } })
      setTableRows(rows)
      setTableSchema(schema)
    } catch (e) {
      console.error("Failed to fetch table:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecuteQuery = async () => {
    if (!query.trim()) return

    setQueryError(null)
    try {
      const { isDestructive } = await checkDestructiveQueryFn({
        data: { sql: query },
      })

      if (isDestructive) {
        setQueryError(
          "⚠️ This appears to be a destructive query. Please verify before executing."
        )
        return
      }

      const result = await executeQueryFn({ data: { sql: query } })
      if (result.rows) {

        setTableRows(result.rows)
        // Derive schema from query results
        if (result.rows.length > 0) {
          const schema = Object.entries(result.rows[0]).map(([column_name, value]) => ({
            column_name,
            data_type: typeof value,
          }))
          setTableSchema(schema)
        } else {
          setTableSchema([])
        }
      } else {
        setTableRows([])
        setTableSchema([])
      }
      setSelectedTable("Query Results")
    } catch (e) {
      setQueryError(
        `Error: ${e instanceof Error ? e.message : "Unknown error"}`
      )
    }
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Database className="h-5 w-5" />
            <span className="font-semibold">SpooderDB</span>
          </div>
          <div className="px-2 pb-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM users"
              className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              rows={4}
            />
            {queryError && (
              <div className="mt-2 rounded bg-destructive/10 p-2 text-xs text-destructive">
                {queryError}
              </div>
            )}
            <Button
              onClick={handleExecuteQuery}
              className="mt-2 w-full"
              size="sm"
            >
              <Play className="mr-2 h-4 w-4" />
              Execute
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Tables</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tables.map((table) => (
                  <SidebarMenuItem key={table}>
                    <SidebarMenuButton
                      isActive={selectedTable === table}
                      onClick={() => handleTableClick(table)}
                    >
                      <Table className="h-4 w-4" />
                      <span>{table}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <SidebarTrigger />
            {selectedTable ? (
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <h1 className="text-xl font-semibold">{selectedTable}</h1>
              </div>
            ) : (
              <h1 className="text-xl font-semibold">Select a table</h1>
            )}
          </div>

          {!selectedTable ? (
            <div className="flex h-[50vh] flex-col items-center justify-center text-muted-foreground">
              <LayoutGrid className="mb-4 h-12 w-12" />
              <p>Select a table from the sidebar to view its data</p>
            </div>
          ) : isLoading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="mb-2 text-sm font-medium">Schema</h2>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border-b p-2 text-left">Column</th>
                        <th className="border-b p-2 text-left">Type</th>
                        <th className="border-b p-2 text-left">Nullable</th>
                        <th className="border-b p-2 text-left">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        tableSchema as Array<{
                          column_name: string
                          data_type: string
                          is_nullable: string
                          column_default: string | null
                        }>
                      ).map((col) => (
                        <tr key={col.column_name} className="border-b">
                          <td className="p-2">{col.column_name}</td>
                          <td className="p-2">{col.data_type}</td>
                          <td className="p-2">{col.is_nullable}</td>
                          <td className="p-2">
                            {col.column_default ?? "NULL"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-medium">
                  Data ({tableRows.length} rows)
                </h2>
                <div className="max-h-[60vh] overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted">
                      <tr>
                        {(tableSchema as Array<{ column_name: string }>).map(
                          (col) => (
                            <th
                              key={col.column_name}
                              className="border-b p-2 text-left font-medium"
                            >
                              {col.column_name}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(tableRows as Array<Record<string, unknown>>).map(
                        (row, idx) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <It's alright>
                          <tr key={idx} className="border-b">
                            {(
                              tableSchema as Array<{ column_name: string }>
                            ).map((col) => (
                              <td key={col.column_name} className="p-2">
                                {String(row[col.column_name] ?? "NULL")}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </>
  )
}
