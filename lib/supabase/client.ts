// Simple client that connects to real Supabase database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface QueryBuilder {
  select: (columns?: string) => QueryBuilder
  insert: (data: any) => QueryBuilder
  update: (data: any) => QueryBuilder
  delete: () => QueryBuilder
  eq: (column: string, value: any) => QueryBuilder
  neq: (column: string, value: any) => QueryBuilder
  gte: (column: string, value: any) => QueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder
  limit: (count: number) => QueryBuilder
  single: () => Promise<{ data: any; error: any }>
  then: (resolve: (result: { data: any; error: any }) => void) => void
  _insertData?: any
  _updateData?: any
  _deleteFlag?: boolean
  execute: () => Promise<{ data: any; error: any }>
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
    insert: (data) => {
      // Store insert data for later execution
      queryBuilder._insertData = data
      return queryBuilder
    },
    update: (data) => {
      // Store update data for later execution
      queryBuilder._updateData = data
      return queryBuilder
    },
    delete: () => {
      // Mark for deletion, will be executed when execute() is called
      queryBuilder._deleteFlag = true
      return queryBuilder
    },
    eq: (column, value) => {
      filters.push(`${column}=eq.${value}`)
      return queryBuilder
    },
    execute: async () => {
      if (queryBuilder._insertData) {
        // Execute insert
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
            method: 'POST',
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(queryBuilder._insertData)
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const result = await response.json()
          return { data: result, error: null }
        } catch (error) {
          return { data: null, error }
        }
      } else if (queryBuilder._updateData) {
        // Execute update
        try {
          const queryString = filters.length > 0 ? `?${filters.join("&")}` : ""
          const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}${queryString}`, {
            method: 'PATCH',
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(queryBuilder._updateData)
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const result = await response.json()
          return { data: result, error: null }
        } catch (error) {
          return { data: null, error }
        }
      } else if (queryBuilder._deleteFlag) {
        // Execute delete
        try {
          const queryString = filters.length > 0 ? `?${filters.join("&")}` : ""
          const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}${queryString}`, {
            method: 'DELETE',
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          return { data: null, error: null }
        } catch (error) {
          return { data: null, error }
        }
      } else {
        // Execute select query
        return await executeQuery()
      }
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

      // Add order parameter (remove leading &)
      if (orderBy) {
        queryParams.push(orderBy.substring(1)) // Remove leading &
      }

      // Add limit parameter (remove leading &)
      if (limitCount) {
        queryParams.push(limitCount.substring(1)) // Remove leading &
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
      const url = `${supabaseUrl}/rest/v1/${tableName}${queryString}`

      console.log("[v0] Fetching from:", url)

      const response = await fetch(url, {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("[v0] HTTP error:", response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Query result:", data)
      return { data, error: null }
    } catch (error) {
      console.error("[v0] Supabase query error:", error)
      return { data: [], error }
    }
  }

  return queryBuilder
}

const supabase = {
  from: (tableName: string) => createQueryBuilder(tableName),
}

export const createClient = () => supabase
export default supabase
