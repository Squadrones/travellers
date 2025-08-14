// Mock Supabase client for v0 environment
export const isSupabaseConfigured = true

// Mock client that returns sample data to prevent errors
const mockClient = {
  from: (table: string) => ({
    select: (columns?: string) => {
      const queryBuilder = {
        eq: (column: string, value: any) => queryBuilder,
        in: (column: string, values: any[]) => queryBuilder,
        gte: (column: string, value: any) => queryBuilder, // Added gte method for date filtering
        order: (column: string, options?: any) => queryBuilder,
        limit: (count: number) => queryBuilder,
        single: () => ({
          then: (callback: any) => {
            // Return single record based on table and query
            let sampleData = null
            if (table === "islands") {
              sampleData = {
                id: 2,
                name: "Bora Bora Lagoon",
                slug: "bora-bora-lagoon",
                description:
                  "Stunning lagoon with volcanic peaks and crystal-clear waters. Experience luxury overwater bungalows and world-class snorkeling in this French Polynesian paradise.",
                short_description: "Stunning lagoon with volcanic peaks",
                featured: true,
                image_url: "/bora-bora-lagoon-aerial.png",
                created_at: new Date().toISOString(),
                country: "French Polynesia",
                region: "Pacific",
                climate: "Tropical",
                currency: "CFP Franc",
                language: "French, Tahitian",
                visa_required: false,
                best_time_to_visit: "May to October",
                time_zone: "GMT-10",
                population: "10,605",
                area: "30.55 km²",
              }
            }
            return Promise.resolve({ data: sampleData, error: null }).then(callback)
          },
        }),
        then: (callback: any) => {
          // Return sample data based on table
          let sampleData = []
          if (table === "islands") {
            sampleData = [
              {
                id: 1,
                name: "Maldives Paradise",
                slug: "maldives-paradise",
                description: "Crystal clear waters and overwater bungalows",
                featured: true,
                image_url: "/maldives-sunset-beach-aerial.png",
                created_at: new Date().toISOString(),
              },
              {
                id: 2,
                name: "Bora Bora Lagoon",
                slug: "bora-bora-lagoon",
                description: "Stunning lagoon with volcanic peaks",
                featured: true,
                image_url: "/bora-bora-lagoon-aerial.png",
                created_at: new Date().toISOString(),
              },
              {
                id: 3,
                name: "Santorini Cliffs",
                slug: "santorini-cliffs",
                description: "Dramatic cliffs and sunset views",
                featured: true,
                image_url: "/santorini-peak-ocean.png",
                created_at: new Date().toISOString(),
              },
            ]
          } else if (table === "destinations") {
            sampleData = [
              {
                id: 1,
                name: "Mount Otemanu",
                description: "Volcanic peak offering hiking and scenic views",
                island_id: 2,
                rating: 4.8,
                price_range: "$50-100",
                category: "Adventure",
                image_url: "/bora-bora-lagoon-aerial.png",
              },
              {
                id: 2,
                name: "Coral Gardens",
                description: "World-class snorkeling and diving spot",
                island_id: 2,
                rating: 4.9,
                price_range: "$30-80",
                category: "Water Sports",
                image_url: "/bora-bora-lagoon-aerial.png",
              },
            ]
          } else if (table === "events") {
            sampleData = [
              {
                id: 1,
                name: "Maldives Music Festival",
                description: "Annual music festival featuring international and local artists",
                start_date: "2024-06-15",
                end_date: "2024-06-17",
                location: "Male, Maldives",
                price: 150,
                category: "Music",
                featured: true,
                image_url: "/maldives-sunset-beach-aerial.png",
                islands: {
                  name: "Maldives Paradise",
                  slug: "maldives-paradise",
                  location: "Indian Ocean",
                },
              },
              {
                id: 2,
                name: "Bora Bora Cultural Festival",
                description: "Celebrate Polynesian culture with traditional dance and food",
                start_date: "2024-07-20",
                end_date: "2024-07-22",
                location: "Vaitape, Bora Bora",
                price: 75,
                category: "Cultural",
                featured: true,
                image_url: "/bora-bora-lagoon-aerial.png",
                islands: {
                  name: "Bora Bora Lagoon",
                  slug: "bora-bora-lagoon",
                  location: "French Polynesia",
                },
              },
              {
                id: 3,
                name: "Santorini Wine Tasting",
                description: "Exclusive wine tasting experience with sunset views",
                start_date: "2024-08-10",
                end_date: "2024-08-10",
                location: "Oia, Santorini",
                price: 120,
                category: "Food & Drink",
                featured: false,
                image_url: "/santorini-peak-ocean.png",
                islands: {
                  name: "Santorini Cliffs",
                  slug: "santorini-cliffs",
                  location: "Greece",
                },
              },
            ]
          }
          return Promise.resolve({ data: sampleData, error: null }).then(callback)
        },
      }
      return queryBuilder
    },
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
}

// Create a function that returns the mock client
export const createClient = () => mockClient

// Create a singleton instance
export const supabase = mockClient

// Default export
export default supabase
