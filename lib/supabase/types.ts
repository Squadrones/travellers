export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          location: string | null
          price: number | null
          capacity: number | null
          featured: boolean | null
          image_url: string | null
          island_id: string | null
          created_at: string
          updated_at: string
          islands?: {
            name: string
            slug: string
            location: string
          } | null
        }
      }
      hotels: {
        Row: {
          id: string
          name: string
          description: string | null
          star_rating: number | null
          rating: number | null
          price_range: string | null
          amenities: string[] | null
          image_url: string | null
          island_id: string | null
          created_at: string
          updated_at: string
          islands?: {
            name: string
            slug: string
            location: string
          } | null
        }
      }
      islands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          location: string | null
          image_url: string | null
          featured: boolean | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
