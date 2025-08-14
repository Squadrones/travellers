export interface Island {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  location: string
  coordinates: { lat: number; lng: number }
  area_km2: number
  population: number
  best_time_to_visit: string
  main_image_url: string
  gallery_images?: string[]
  cultural_info: string
  regulatory_info: string
  visa_requirements: string
  currency: string
  languages: string[]
  climate_info: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Destination {
  id: string
  island_id: string
  name: string
  type: string
  description: string
  coordinates: { lat: number; lng: number }
  image_url: string
  rating: number
  price_range: string
  opening_hours?: any
  contact_info?: any
  website_url?: string
  booking_url?: string
  created_at: string
}

export interface Event {
  id: string
  island_id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date?: string
  start_time?: string
  end_time?: string
  location: string
  coordinates?: { lat: number; lng: number }
  image_url?: string
  ticket_price?: number
  ticket_url?: string
  organizer?: string
  contact_info?: any
  featured: boolean
  created_at: string
}

export interface Hotel {
  id: string
  island_id: string
  name: string
  description: string
  star_rating: number
  coordinates: { lat: number; lng: number }
  address: string
  image_url: string
  gallery_images?: string[]
  amenities?: string[]
  room_types?: any[]
  price_range: string
  booking_url?: string
  affiliate_id?: string
  website_url?: string
  phone?: string
  email?: string
  rating: number
  review_count: number
  created_at: string
}
