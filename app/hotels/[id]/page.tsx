import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Star, MapPin, Wifi, Car, Coffee, Waves, Utensils, Dumbbell } from "lucide-react"

interface HotelDetailPageProps {
  params: { id: string }
}

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const supabase = createClient()

  const { data: hotel, error } = await supabase
    .from("hotels")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !hotel) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes("wifi")) return <Wifi className="h-5 w-5" />
    if (lower.includes("transfer") || lower.includes("car")) return <Car className="h-5 w-5" />
    if (lower.includes("coffee") || lower.includes("breakfast")) return <Coffee className="h-5 w-5" />
    if (lower.includes("pool") || lower.includes("beach")) return <Waves className="h-5 w-5" />
    if (lower.includes("restaurant") || lower.includes("dining")) return <Utensils className="h-5 w-5" />
    if (lower.includes("gym") || lower.includes("fitness")) return <Dumbbell className="h-5 w-5" />
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hotel Hero */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={
            hotel.image_url || `/placeholder.svg?height=600&width=1200&query=${hotel.name} luxury hotel resort exterior`
          }
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-4xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(hotel.rating)}
                <span className="ml-2 text-sm">{hotel.rating} Star Hotel</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{hotel.islands.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="font-serif text-2xl font-semibold mb-4">About This Hotel</h2>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getAmenityIcon(amenity) || <div className="h-5 w-5 bg-cyan-100 rounded-full" />}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">${hotel.price_per_night}</div>
                <div className="text-gray-600">per night</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">{renderStars(hotel.rating)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-medium">{hotel.price_range}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{hotel.islands.name}</span>
                </div>
              </div>

              <a
                href={hotel.booking_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-center block"
              >
                Book Now
              </a>

              <p className="text-xs text-gray-500 text-center mt-3">You'll be redirected to our booking partner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
