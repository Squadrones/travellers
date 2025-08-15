import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Waves,
  Utensils,
  Dumbbell,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

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

  const { data: allHotels } = await supabase.from("hotels").select("id, name").order("id")

  const { data: nearbyHotels } = await supabase
    .from("hotels")
    .select(`
      *,
      islands (name, slug, location)
    `)
    .eq("island_id", hotel.island_id)
    .neq("id", hotel.id)
    .limit(3)

  const { data: nearbyEvents } = await supabase
    .from("events")
    .select(`
      *,
      islands (name, slug, location)
    `)
    .eq("island_id", hotel.island_id)
    .gte("start_date", new Date().toISOString().split("T")[0])
    .limit(4)

  const { data: otherIslands } = await supabase.from("islands").select("*").neq("id", hotel.island_id).limit(3)

  const currentIndex = allHotels?.findIndex((h) => h.id === Number.parseInt(params.id)) ?? -1
  const prevHotel = currentIndex > 0 ? allHotels?.[currentIndex - 1] : null
  const nextHotel = currentIndex < (allHotels?.length ?? 0) - 1 ? allHotels?.[currentIndex + 1] : null

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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-cyan-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/hotels" className="hover:text-cyan-600 transition-colors">
                Hotels
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{hotel.name}</span>
            </div>
            <Link
              href="/hotels"
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Hotels
            </Link>
          </div>
        </div>
      </div>

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
                <Link
                  href={`/islands/${hotel.islands.slug}`}
                  className="text-sm hover:text-cyan-200 transition-colors underline"
                >
                  {hotel.islands.location}
                </Link>
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
                  <Link
                    href={`/islands/${hotel.islands.slug}`}
                    className="font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    {hotel.islands.name}
                  </Link>
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

        {/* Personalized Recommendations */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl font-bold text-center mb-12 text-gray-900">
            Personalized Recommendations
          </h2>

          {/* Nearby Events */}
          {nearbyEvents && nearbyEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-semibold text-gray-900">Events Near {hotel.name}</h3>
                <Link
                  href={`/events?island=${hotel.islands.slug}`}
                  className="text-cyan-600 hover:text-cyan-700 transition-colors text-sm font-medium"
                >
                  View All Events →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.image_url || `/placeholder.svg?height=200&width=300&query=${event.title} event`}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{new Date(event.start_date).toLocaleDateString()}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-cyan-600">{event.category}</span>
                        <span className="text-sm font-bold text-gray-900">${event.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Hotels */}
          {nearbyHotels && nearbyHotels.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-semibold text-gray-900">
                  Other Hotels on {hotel.islands.name}
                </h3>
                <Link
                  href={`/hotels?island=${hotel.islands.slug}`}
                  className="text-cyan-600 hover:text-cyan-700 transition-colors text-sm font-medium"
                >
                  View All Hotels →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyHotels.map((nearbyHotel) => (
                  <Link
                    key={nearbyHotel.id}
                    href={`/hotels/${nearbyHotel.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={
                          nearbyHotel.image_url ||
                          `/placeholder.svg?height=200&width=300&query=${nearbyHotel.name} hotel`
                        }
                        alt={nearbyHotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{nearbyHotel.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(nearbyHotel.rating)}
                        <span className="text-sm text-gray-600 ml-1">{nearbyHotel.rating} stars</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{nearbyHotel.price_range}</span>
                        <span className="text-sm font-bold text-gray-900">${nearbyHotel.price_per_night}/night</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Explore Other Islands */}
          {otherIslands && otherIslands.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-semibold text-gray-900">Explore Other Paradise Islands</h3>
                <Link
                  href="/islands"
                  className="text-cyan-600 hover:text-cyan-700 transition-colors text-sm font-medium"
                >
                  View All Islands →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherIslands.map((island) => (
                  <Link
                    key={island.id}
                    href={`/islands/${island.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={
                          island.image_url ||
                          `/placeholder.svg?height=200&width=300&query=${island.name} island paradise`
                        }
                        alt={island.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{island.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{island.location}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{island.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-4">Ready to Plan Your Perfect Trip?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Combine your hotel stay with exciting events and explore multiple islands for the ultimate paradise
              experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/plan-trip"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Plan Your Trip
              </Link>
              <Link
                href={`/events?island=${hotel.islands.slug}`}
                className="bg-white hover:bg-gray-50 text-cyan-600 border border-cyan-200 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Local Events
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <div className="flex-1">
            {prevHotel && (
              <Link
                href={`/hotels/${prevHotel.id}`}
                className="flex items-center gap-3 text-cyan-600 hover:text-cyan-700 transition-colors group"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-sm text-gray-500">Previous Hotel</div>
                  <div className="font-medium">{prevHotel.name}</div>
                </div>
              </Link>
            )}
          </div>

          <div className="flex-1 text-right">
            {nextHotel && (
              <Link
                href={`/hotels/${nextHotel.id}`}
                className="flex items-center justify-end gap-3 text-cyan-600 hover:text-cyan-700 transition-colors group"
              >
                <div className="text-right">
                  <div className="text-sm text-gray-500">Next Hotel</div>
                  <div className="font-medium">{nextHotel.name}</div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
