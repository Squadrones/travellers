# 🗄️ Database Schema

This document describes the database structure for the Island Paradise platform, including tables, relationships, and data flow.

## 📊 Database Overview

The platform uses **Supabase** as the backend service, which provides:
- **PostgreSQL** database
- **Real-time subscriptions**
- **Row Level Security (RLS)**
- **Automatic API generation**

## 🏗️ Table Structure

### **1. Islands Table**
The main table storing island destination information.

```sql
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
```

**Key Fields**:
- `id`: Unique identifier (UUID)
- `slug`: URL-friendly identifier (e.g., "bora-bora", "santorini")
- `coordinates`: Geographic coordinates for mapping
- `featured`: Boolean flag for homepage display
- `gallery_images`: JSON array of image URLs

**Indexes**:
```sql
CREATE INDEX idx_islands_slug ON islands(slug);
CREATE INDEX idx_islands_featured ON islands(featured);
```

### **2. Destinations Table**
Specific locations and attractions within islands.

```sql
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
```

**Key Fields**:
- `island_id`: Foreign key to islands table
- `type`: Categorization of destination
- `rating`: User rating (0.0 to 5.0)
- `price_range`: Cost indicator
- `opening_hours`: JSON object with schedule

**Indexes**:
```sql
CREATE INDEX idx_destinations_island_id ON destinations(island_id);
CREATE INDEX idx_destinations_type ON destinations(type);
```

### **3. Events Table**
Island events, festivals, and activities.

```sql
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
```

**Key Fields**:
- `island_id`: Foreign key to islands table
- `event_type`: Category of event
- `start_date`/`end_date`: Event duration
- `ticket_price`: Cost of admission
- `featured`: Boolean flag for homepage display

**Indexes**:
```sql
CREATE INDEX idx_events_island_id ON events(island_id);
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_featured ON events(featured);
```

### **4. Hotels Table**
Accommodation options on islands.

```sql
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
```

**Key Fields**:
- `island_id`: Foreign key to islands table
- `star_rating`: Official hotel rating (1-5 stars)
- `amenities`: JSON array of available facilities
- `room_types`: JSON array of room configurations
- `rating`: User rating (0.0 to 5.0)

**Indexes**:
```sql
CREATE INDEX idx_hotels_island_id ON hotels(island_id);
CREATE INDEX idx_hotels_rating ON hotels(star_rating);
```

## 🔗 Relationships

### **Primary Relationships**
```
islands (1) ←→ (many) destinations
islands (1) ←→ (many) events  
islands (1) ←→ (many) hotels
```

### **Relationship Details**

#### **Islands → Destinations**
- One island can have multiple destinations
- Destinations are automatically deleted when island is removed
- Used for: Beach locations, landmarks, restaurants

#### **Islands → Events**
- One island can host multiple events
- Events are automatically deleted when island is removed
- Used for: Festivals, cultural events, activities

#### **Islands → Hotels**
- One island can have multiple hotels
- Hotels are automatically deleted when island is removed
- Used for: Accommodation options

## 📊 Data Types

### **JSONB Fields**
Several fields use JSONB for flexible data storage:

#### **Coordinates**
```json
{
  "lat": 16.5000,
  "lng": -151.7500
}
```

#### **Gallery Images**
```json
[
  "/images/island1.jpg",
  "/images/island2.jpg",
  "/images/island3.jpg"
]
```

#### **Languages**
```json
[
  "English",
  "French",
  "Tahitian"
]
```

#### **Amenities**
```json
[
  "WiFi",
  "Pool",
  "Spa",
  "Restaurant"
]
```

#### **Room Types**
```json
[
  {
    "name": "Standard Room",
    "description": "Comfortable room with ocean view",
    "price": 200,
    "capacity": 2
  }
]
```

## 🔍 Query Examples

### **Featured Islands**
```sql
SELECT id, name, slug, short_description, main_image_url
FROM islands 
WHERE featured = true 
ORDER BY created_at DESC;
```

### **Island with Destinations**
```sql
SELECT 
  i.name as island_name,
  i.description as island_description,
  d.name as destination_name,
  d.type as destination_type,
  d.rating as destination_rating
FROM islands i
LEFT JOIN destinations d ON i.id = d.island_id
WHERE i.slug = 'bora-bora';
```

### **Events by Date Range**
```sql
SELECT 
  e.title,
  e.start_date,
  e.location,
  i.name as island_name
FROM events e
JOIN islands i ON e.island_id = i.id
WHERE e.start_date BETWEEN '2024-06-01' AND '2024-08-31'
ORDER BY e.start_date;
```

### **Hotels with Ratings**
```sql
SELECT 
  h.name,
  h.star_rating,
  h.rating as user_rating,
  h.price_range,
  i.name as island_name
FROM hotels h
JOIN islands i ON h.island_id = i.id
WHERE h.rating >= 4.0
ORDER BY h.rating DESC;
```

## 🚀 Performance Optimization

### **Indexing Strategy**
- **Primary Keys**: UUID for scalability
- **Foreign Keys**: Indexed for join performance
- **Search Fields**: Slug, featured flags, ratings
- **Date Fields**: Indexed for time-based queries

### **Query Optimization**
- Use specific column selection instead of `SELECT *`
- Leverage JSONB operators for complex queries
- Implement pagination for large result sets
- Use appropriate WHERE clauses to limit data

## 🔒 Security Considerations

### **Row Level Security (RLS)**
```sql
-- Enable RLS on tables
ALTER TABLE islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

-- Example policy for public read access
CREATE POLICY "Public read access" ON islands
FOR SELECT USING (true);
```

### **Data Validation**
- **Check Constraints**: Rating ranges, star ratings
- **Foreign Key Constraints**: Referential integrity
- **Unique Constraints**: Slugs, email addresses
- **NOT NULL Constraints**: Required fields

## 📈 Scaling Considerations

### **Current Design**
- **UUID Primary Keys**: Distributed-friendly
- **JSONB Fields**: Flexible schema evolution
- **Normalized Structure**: Efficient storage and updates

### **Future Enhancements**
- **Partitioning**: By date for events, by region for islands
- **Materialized Views**: For complex aggregations
- **Full-Text Search**: For destination and event search
- **Caching Layer**: Redis for frequently accessed data

## 🛠️ Database Setup

### **Initial Setup**
```bash
# Run in Supabase SQL Editor
\i scripts/01-create-tables.sql
```

### **Data Seeding**
```bash
# Seed with sample data
\i scripts/02-seed-islands.sql
\i scripts/03-seed-destinations.sql
\i scripts/04-seed-events.sql
\i scripts/05-seed-hotels.sql
```

### **Verification**
```sql
-- Check table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check data population
SELECT COUNT(*) as island_count FROM islands;
SELECT COUNT(*) as destination_count FROM destinations;
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as hotel_count FROM hotels;
```

## 📚 Additional Resources

- **[Supabase Documentation](https://supabase.com/docs)** - Official Supabase guides
- **[PostgreSQL Documentation](https://www.postgresql.org/docs/)** - Database reference
- **[Database Migration Guide](./database-migrations.md)** - Schema evolution
- **[Query Performance Guide](./query-performance.md)** - Optimization tips

---

*For database-specific questions, check the SQL scripts in the `scripts/` directory or consult the Supabase documentation.*
