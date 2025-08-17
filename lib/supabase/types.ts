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
      trips: {
        Row: {
          id: string
          short_id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          travelers: number
          budget: number | null
          is_public: boolean
          allow_comments: boolean
          allow_collaboration: boolean
          cover_image_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
          views_count: number
          likes_count: number
          comments_count: number
        }
        Insert: {
          id?: string
          short_id?: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          travelers?: number
          budget?: number | null
          is_public?: boolean
          allow_comments?: boolean
          allow_collaboration?: boolean
          cover_image_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          views_count?: number
          likes_count?: number
          comments_count?: number
        }
        Update: {
          id?: string
          short_id?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          travelers?: number
          budget?: number | null
          is_public?: boolean
          allow_comments?: boolean
          allow_collaboration?: boolean
          cover_image_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          views_count?: number
          likes_count?: number
          comments_count?: number
        }
      }
      trip_items: {
        Row: {
          id: string
          trip_id: string
          type: string
          title: string
          description: string | null
          day: number
          time: string | null
          duration: string | null
          location: string | null
          price: number
          image_url: string | null
          category: string | null
          rating: number | null
          external_id: string | null
          external_type: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          type: string
          title: string
          description?: string | null
          day: number
          time?: string | null
          duration?: string | null
          location?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          rating?: number | null
          external_id?: string | null
          external_type?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          type?: string
          title?: string
          description?: string | null
          day?: number
          time?: string | null
          duration?: string | null
          location?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          rating?: number | null
          external_id?: string | null
          external_type?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      trip_collaborators: {
        Row: {
          id: string
          trip_id: string
          email: string
          role: string
          invited_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          trip_id: string
          email: string
          role?: string
          invited_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          trip_id?: string
          email?: string
          role?: string
          invited_at?: string
          accepted_at?: string | null
        }
      }
      trip_comments: {
        Row: {
          id: string
          trip_id: string
          author_email: string
          author_name: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          author_email: string
          author_name?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          author_email?: string
          author_name?: string | null
          content?: string
          created_at?: string
        }
      }
    }
  }
}
