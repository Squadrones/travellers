-- Islands table - stores main island information
CREATE TABLE islands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  location VARCHAR(255),
  coordinates JSONB, -- {lat: number, lng: number}
  area_km2 DECIMAL(10,2),
  population INTEGER,
  best_time_to_visit VARCHAR(255),
  main_image_url TEXT,
  gallery_images JSONB, -- array of image URLs
  cultural_info TEXT,
  regulatory_info TEXT,
  visa_requirements TEXT,
  currency VARCHAR(10),
  languages JSONB, -- array of languages
  climate_info TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destinations table - specific locations within islands
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  island_id UUID REFERENCES islands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- beach, landmark, restaurant, hotel, activity
  description TEXT,
  coordinates JSONB, -- {lat: number, lng: number}
  image_url TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  price_range VARCHAR(10), -- $, $$, $$$, $$$$
  opening_hours JSONB,
  contact_info JSONB,
  website_url TEXT,
  booking_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table - island events and activities
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  island_id UUID REFERENCES islands(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(100), -- festival, concert, cultural, sports
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  coordinates JSONB,
  image_url TEXT,
  ticket_price DECIMAL(10,2),
  ticket_url TEXT,
  organizer VARCHAR(255),
  contact_info JSONB,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotels table - accommodation options
CREATE TABLE hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  island_id UUID REFERENCES islands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  coordinates JSONB,
  address TEXT,
  image_url TEXT,
  gallery_images JSONB,
  amenities JSONB, -- array of amenities
  room_types JSONB, -- array of room type objects
  price_range VARCHAR(10),
  booking_url TEXT,
  affiliate_id VARCHAR(255),
  website_url TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_islands_slug ON islands(slug);
CREATE INDEX idx_islands_featured ON islands(featured);
CREATE INDEX idx_destinations_island_id ON destinations(island_id);
CREATE INDEX idx_destinations_type ON destinations(type);
CREATE INDEX idx_events_island_id ON events(island_id);
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_featured ON events(featured);
CREATE INDEX idx_hotels_island_id ON hotels(island_id);
CREATE INDEX idx_hotels_rating ON hotels(star_rating);
