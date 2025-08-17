import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Trip = Database['public']['Tables']['trips']['Row']
type TripInsert = Database['public']['Tables']['trips']['Insert']
type TripUpdate = Database['public']['Tables']['trips']['Update']
type TripItem = Database['public']['Tables']['trip_items']['Row']
type TripItemInsert = Database['public']['Tables']['trip_items']['Insert']

const supabase = createClient()

export class TripService {
  // Save a new trip with itinerary items
  static async saveTrip(tripData: Omit<TripInsert, 'id' | 'short_id'>, itineraryItems: Omit<TripItemInsert, 'id' | 'trip_id'>[]): Promise<{ trip: Trip; shortId: string } | null> {
    try {
      console.log('Saving trip with data:', tripData)
      console.log('Saving itinerary items:', itineraryItems)

      // Insert the trip
      console.log('Attempting to insert trip with data:', tripData)
      
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single()

      console.log('Trip insert result:', { trip, tripError })

      if (tripError) {
        console.error('Error saving trip:', tripError)
        
        // Handle duplicate short_id error specifically
        if (tripError.code === '23505' && tripError.message.includes('short_id')) {
          console.error('Duplicate short_id detected. This should not happen with the improved generation function.')
          // You could implement retry logic here if needed
        }
        
        return null
      }

      if (!trip) {
        console.error('No trip data returned after insert')
        return null
      }

      console.log('Trip saved successfully with short_id:', trip.short_id)

      // Insert all itinerary items
      if (itineraryItems.length > 0) {
        const itemsWithTripId = itineraryItems.map(item => ({
          ...item,
          trip_id: trip.id
        }))

        console.log('Inserting trip items:', itemsWithTripId)

        const { error: itemsError } = await supabase
          .from('trip_items')
          .insert(itemsWithTripId)

        if (itemsError) {
          console.error('Error saving trip items:', itemsError)
          // Optionally delete the trip if items fail to save
          await supabase.from('trips').delete().eq('id', trip.id)
          return null
        }

        console.log('Trip items saved successfully')
      }

      return { trip, shortId: trip.short_id }
    } catch (error) {
      console.error('Error in saveTrip:', error)
      return null
    }
  }

  // Load a trip by short ID
  static async loadTripByShortId(shortId: string): Promise<{ trip: Trip; items: TripItem[] } | null> {
    try {
      console.log('Loading trip with short ID:', shortId)

      // Get the trip
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('short_id', shortId)
        .single()

      if (tripError || !trip) {
        console.error('Error loading trip:', tripError)
        return null
      }

      console.log('Trip loaded:', trip)

      // Increment view count
      await supabase
        .from('trips')
        .update({ views_count: (trip.views_count || 0) + 1 })
        .eq('id', trip.id)

      // Get the itinerary items
      const { data: items, error: itemsError } = await supabase
        .from('trip_items')
        .select('*')
        .eq('trip_id', trip.id)
        .order('day', { ascending: true })
        .order('sort_order', { ascending: true })

      if (itemsError) {
        console.error('Error loading trip items:', itemsError)
        return { trip, items: [] }
      }

      console.log('Trip items loaded:', items)

      return { trip, items: items || [] }
    } catch (error) {
      console.error('Error in loadTripByShortId:', error)
      return null
    }
  }

  // Update an existing trip
  static async updateTrip(tripId: string, tripData: TripUpdate, itineraryItems: Omit<TripItemInsert, 'id' | 'trip_id'>[]): Promise<boolean> {
    try {
      // Update the trip
      const { error: tripError } = await supabase
        .from('trips')
        .update(tripData)
        .eq('id', tripId)

      if (tripError) {
        console.error('Error updating trip:', tripError)
        return false
      }

      // Delete existing items and insert new ones
      const { error: deleteError } = await supabase
        .from('trip_items')
        .delete()
        .eq('trip_id', tripId)

      if (deleteError) {
        console.error('Error deleting old trip items:', deleteError)
        return false
      }

      // Insert new items
      if (itineraryItems.length > 0) {
        const itemsWithTripId = itineraryItems.map(item => ({
          ...item,
          trip_id: tripId
        }))

        const { error: itemsError } = await supabase
          .from('trip_items')
          .insert(itemsWithTripId)

        if (itemsError) {
          console.error('Error updating trip items:', itemsError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in updateTrip:', error)
      return false
    }
  }

  // Get public trips for discovery
  static async getPublicTrips(limit: number = 10): Promise<Trip[]> {
    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error loading public trips:', error)
        return []
      }

      return trips || []
    } catch (error) {
      console.error('Error in getPublicTrips:', error)
      return []
    }
  }

  // Add a comment to a trip
  static async addComment(tripId: string, authorEmail: string, authorName: string, content: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trip_comments')
        .insert({
          trip_id: tripId,
          author_email: authorEmail,
          author_name: authorName,
          content
        })

      if (error) {
        console.error('Error adding comment:', error)
        return false
      }

      // Increment comment count
      await supabase
        .from('trips')
        .update({ comments_count: 1 })
        .eq('id', tripId)

      return true
    } catch (error) {
      console.error('Error in addComment:', error)
      return false
    }
  }

  // Get comments for a trip
  static async getTripComments(tripId: string): Promise<any[]> {
    try {
      const { data: comments, error } = await supabase
        .from('trip_comments')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading comments:', error)
        return []
      }

      return comments || []
    } catch (error) {
      console.error('Error in getTripComments:', error)
      return []
    }
  }

  // Add a collaborator to a trip
  static async addCollaborator(tripId: string, email: string, role: string = 'viewer'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trip_collaborators')
        .insert({
          trip_id: tripId,
          email,
          role
        })

      if (error) {
        console.error('Error adding collaborator:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in addCollaborator:', error)
      return false
    }
  }

  // Get collaborators for a trip
  static async getTripCollaborators(tripId: string): Promise<any[]> {
    try {
      const { data: collaborators, error } = await supabase
        .from('trip_collaborators')
        .select('*')
        .eq('trip_id', tripId)

      if (error) {
        console.error('Error loading collaborators:', error)
        return []
      }

      return collaborators || []
    } catch (error) {
      console.error('Error in getTripCollaborators:', error)
      return []
    }
  }

  // Like a trip
  static async likeTrip(tripId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ likes_count: 1 })
        .eq('id', tripId)

      if (error) {
        console.error('Error liking trip:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in likeTrip:', error)
      return false
    }
  }

  // Check if a short ID is available
  static async isShortIdAvailable(shortId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('short_id')
        .eq('short_id', shortId)
        .single()

      if (error && error.code === 'PGRST116') {
        // No rows returned, ID is available
        return true
      }

      return !data
    } catch (error) {
      console.error('Error checking short ID availability:', error)
      return false
    }
  }

  // Get all short IDs to check for duplicates (for debugging)
  static async getAllShortIds(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('short_id')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading short IDs:', error)
        return []
      }

      return data?.map((trip: any) => trip.short_id) || []
    } catch (error) {
      console.error('Error in getAllShortIds:', error)
      return []
    }
  }

  // Check for duplicate short IDs (for debugging)
  static async checkForDuplicateShortIds(): Promise<{ shortId: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('short_id')
        .order('short_id', { ascending: true })

      if (error) {
        console.error('Error loading short IDs for duplicate check:', error)
        return []
      }

      const shortIds = data?.map((trip: any) => trip.short_id) || []
      const duplicates: { [key: string]: number } = {}

      shortIds.forEach((id: string) => {
        duplicates[id] = (duplicates[id] || 0) + 1
      })

      return Object.entries(duplicates)
        .filter(([_, count]) => count > 1)
        .map(([shortId, count]) => ({ shortId, count }))
    } catch (error) {
      console.error('Error in checkForDuplicateShortIds:', error)
      return []
    }
  }

  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing database connection...')
      const { data, error } = await supabase
        .from('trips')
        .select('id')
        .limit(1)

      if (error) {
        console.error('Database connection test failed:', error)
        return false
      }

      console.log('Database connection test successful')
      return true
    } catch (error) {
      console.error('Database connection test error:', error)
      return false
    }
  }
}
