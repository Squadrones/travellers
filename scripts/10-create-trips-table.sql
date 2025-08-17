-- Create trips table for storing user trip itineraries
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  travelers INTEGER DEFAULT 1,
  budget DECIMAL(10,2),
  is_public BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  allow_collaboration BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0
);

-- Ensure short_id uniqueness with explicit constraint
ALTER TABLE trips ADD CONSTRAINT trips_short_id_unique UNIQUE (short_id);

-- Create trip_items table for storing individual itinerary items
CREATE TABLE IF NOT EXISTS trip_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'island', 'activity', 'hotel', 'event'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  day INTEGER NOT NULL,
  time TIME,
  duration VARCHAR(100),
  location VARCHAR(255),
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2),
  external_id VARCHAR(255), -- Reference to islands, events, hotels tables
  external_type VARCHAR(50), -- 'island', 'event', 'hotel'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_collaborators table for collaboration features
CREATE TABLE IF NOT EXISTS trip_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer', -- 'viewer', 'editor', 'admin'
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(trip_id, email)
);

-- Create trip_comments table for comments on trips
CREATE TABLE IF NOT EXISTS trip_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  author_email VARCHAR(255) NOT NULL,
  author_name VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_short_id ON trips(short_id);
CREATE INDEX IF NOT EXISTS idx_trips_public ON trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trip_items_trip_id ON trip_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_day ON trip_items(trip_id, day);
CREATE INDEX IF NOT EXISTS idx_trip_collaborators_trip_id ON trip_collaborators(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_comments_trip_id ON trip_comments(trip_id);

-- Create function to generate short IDs with better uniqueness
CREATE OR REPLACE FUNCTION generate_short_id() RETURNS VARCHAR(10) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR(10) := '';
  i INTEGER := 0;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  -- Try to generate a unique ID
  LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
    END LOOP;
    
    -- Check if this ID already exists
    IF NOT EXISTS (SELECT 1 FROM trips WHERE short_id = result) THEN
      RETURN result;
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      -- If we can't find a unique ID after max attempts, add timestamp suffix
      result := result || substr(to_char(extract(epoch from now())::bigint, '999999999'), 1, 2);
      RETURN result;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate short_id
CREATE OR REPLACE FUNCTION set_short_id() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.short_id IS NULL THEN
    NEW.short_id := generate_short_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_short_id
  BEFORE INSERT ON trips
  FOR EACH ROW
  EXECUTE FUNCTION set_short_id();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample trips for testing
INSERT INTO trips (name, description, start_date, end_date, travelers, budget, is_public, tags) VALUES
('Mediterranean Island Hopping', 'A 10-day adventure across the most beautiful Greek islands, featuring ancient history, stunning beaches, and unforgettable sunsets.', '2024-06-15', '2024-06-25', 2, 3500, true, ARRAY['Adventure', 'Culture', 'Romance', 'Beach']),
('Tropical Paradise Adventure', '7 days in Bali exploring temples, beaches, and local culture', '2024-07-01', '2024-07-08', 4, 2200, true, ARRAY['Family', 'Culture', 'Adventure']),
('Caribbean Island Escape', 'Luxury resort hopping across the Caribbean islands', '2024-08-10', '2024-08-17', 2, 5800, true, ARRAY['Luxury', 'Romance', 'Beach']);
