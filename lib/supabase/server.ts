// Server-side client that connects to real Supabase database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface QueryBuilder {
  select: (columns?: string) => QueryBuilder
  eq: (column: string, value: any) => QueryBuilder
  neq: (column: string, value: any) => QueryBuilder
  gte: (column: string, value: any) => QueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder
  limit: (count: number) => QueryBuilder
  single: () => Promise<{ data: any; error: any }>
  then: (resolve: (result: { data: any; error: any }) => void) => void
}

function createQueryBuilder(tableName: string): QueryBuilder {
  let selectColumns = "*"
  const filters: string[] = []
  let orderBy = ""
  let limitCount = ""

  const queryBuilder: QueryBuilder = {
    select: (columns = "*") => {
      selectColumns = columns
      return queryBuilder
    },
    eq: (column, value) => {
      filters.push(`${column}=eq.${value}`)
      return queryBuilder
    },
    neq: (column, value) => {
      filters.push(`${column}=neq.${value}`)
      return queryBuilder
    },
    gte: (column, value) => {
      filters.push(`${column}=gte.${value}`)
      return queryBuilder
    },
    order: (column, options = {}) => {
      const direction = options.ascending === false ? "desc" : "asc"
      orderBy = `&order=${column}.${direction}`
      return queryBuilder
    },
    limit: (count) => {
      limitCount = `&limit=${count}`
      return queryBuilder
    },
    single: async () => {
      const result = await executeQuery()
      return {
        data: result.data?.[0] || null,
        error: result.error,
      }
    },
    then: (resolve) => {
      executeQuery().then(resolve)
    },
  }

  const executeQuery = async () => {
    try {
      const queryParams = []

      // Add filters
      if (filters.length > 0) {
        queryParams.push(...filters)
      }

      // Add order parameter
      if (orderBy) {
        queryParams.push(orderBy.substring(1)) // Remove the leading &
      }

      // Add limit parameter
      if (limitCount) {
        queryParams.push(limitCount.substring(1)) // Remove the leading &
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
      const url = `${supabaseUrl}/rest/v1/${tableName}${queryString}`

      console.log("[v0] Server fetching from:", url)

      const response = await fetch(url, {
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("[v0] Server HTTP error:", response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Server query result:", data)
      return { data, error: null }
    } catch (error) {
      console.error("[v0] Server Supabase query error:", error)
      return { data: [], error }
    }
  }

  return queryBuilder
}

const supabase = {
  from: (tableName: string) => createQueryBuilder(tableName),
}

export const createClient = () => supabase
export const createServerClient = createClient
export default supabase
