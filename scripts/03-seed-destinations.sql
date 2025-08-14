-- Insert sample destinations for each island
INSERT INTO destinations (island_id, name, type, description, coordinates, image_url, rating, price_range) VALUES

-- Santorini destinations
((SELECT id FROM islands WHERE slug = 'santorini'), 'Oia Village', 'landmark', 'Famous for the most spectacular sunsets in the world, with traditional Cycladic architecture and blue-domed churches.', '{"lat": 36.4618, "lng": 25.3753}', '/placeholder.svg?height=400&width=600', 4.8, '$$$'),
((SELECT id FROM islands WHERE slug = 'santorini'), 'Red Beach', 'beach', 'Unique beach with dramatic red volcanic cliffs and crystal-clear waters, perfect for swimming and photography.', '{"lat": 36.3496, "lng": 25.3957}', '/placeholder.svg?height=400&width=600', 4.5, '$'),
((SELECT id FROM islands WHERE slug = 'santorini'), 'Akrotiri Archaeological Site', 'landmark', 'Ancient Minoan city preserved by volcanic ash, offering insights into Bronze Age civilization.', '{"lat": 36.3567, "lng": 25.4013}', '/placeholder.svg?height=400&width=600', 4.6, '$$'),

-- Bali destinations  
((SELECT id FROM islands WHERE slug = 'bali'), 'Tegallalang Rice Terraces', 'landmark', 'Stunning stepped rice paddies offering breathtaking views and traditional Balinese agriculture.', '{"lat": -8.4305, "lng": 115.2828}', '/placeholder.svg?height=400&width=600', 4.7, '$'),
((SELECT id FROM islands WHERE slug = 'bali'), 'Tanah Lot Temple', 'landmark', 'Iconic Hindu temple perched on a rock formation in the sea, especially beautiful at sunset.', '{"lat": -8.6211, "lng": 115.0868}', '/placeholder.svg?height=400&width=600', 4.6, '$'),
((SELECT id FROM islands WHERE slug = 'bali'), 'Seminyak Beach', 'beach', 'Trendy beach destination with upscale beach clubs, surfing, and vibrant nightlife.', '{"lat": -8.6905, "lng": 115.1656}', '/placeholder.svg?height=400&width=600', 4.4, '$$$'),

-- Maldives destinations
((SELECT id FROM islands WHERE slug = 'maldives'), 'Malé Fish Market', 'landmark', 'Vibrant local market showcasing fresh seafood and Maldivian culture in the capital city.', '{"lat": 4.1755, "lng": 73.5093}', '/placeholder.svg?height=400&width=600', 4.2, '$'),
((SELECT id FROM islands WHERE slug = 'maldives'), 'Banana Reef', 'activity', 'World-renowned diving site with vibrant coral formations and diverse marine life.', '{"lat": 4.2833, "lng": 73.5333}', '/placeholder.svg?height=400&width=600', 4.9, '$$'),

-- Maui destinations
((SELECT id FROM islands WHERE slug = 'maui'), 'Haleakala National Park', 'landmark', 'Sacred volcano offering spectacular sunrise views and unique high-altitude desert landscape.', '{"lat": 20.7097, "lng": -156.2533}', '/placeholder.svg?height=400&width=600', 4.8, '$'),
((SELECT id FROM islands WHERE slug = 'maui'), 'Road to Hana', 'activity', 'Scenic coastal drive with waterfalls, bamboo forests, and breathtaking ocean views.', '{"lat": 20.7580, "lng": -156.0444}', '/placeholder.svg?height=400&width=600', 4.7, '$'),
((SELECT id FROM islands WHERE slug = 'maui'), 'Molokini Crater', 'activity', 'Crescent-shaped volcanic crater offering world-class snorkeling with tropical fish and coral.', '{"lat": 20.6280, "lng": -156.4950}', '/placeholder.svg?height=400&width=600', 4.8, '$$'),

-- Seychelles destinations
((SELECT id FROM islands WHERE slug = 'seychelles'), 'Anse Source d''Argent', 'beach', 'One of the world''s most photographed beaches with unique granite boulders and pristine sand.', '{"lat": -4.3667, "lng": 55.8167}', '/placeholder.svg?height=400&width=600', 4.9, '$$'),
((SELECT id FROM islands WHERE slug = 'seychelles'), 'Vallée de Mai', 'landmark', 'UNESCO World Heritage site home to the legendary Coco de Mer palm and rare endemic species.', '{"lat": -4.3333, "lng": 55.7333}', '/placeholder.svg?height=400&width=600', 4.7, '$$');
