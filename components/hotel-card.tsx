"use client"

import type { Hotel } from "@/lib/types"
import { Star, Wifi, Car } from "lucide-react"
import Link from "next/link"

interface HotelCardProps {
  hotel: Hotel & { islands: { name: string; slug: string; location: string } }
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getPriceRangeDescription = (range: string) => {
    const descriptions = {
      $: "Budget-friendly",
      $$: "Moderate",
      $$$: "Upscale",
      $$$$: "Luxury",
    }
    return descriptions[range as keyof typeof descriptions] || range
  }

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes("wifi")) return <Wifi className="h-3 w-3" />
    if (lower.includes("transfer") || lower.includes("car")) return <Car className="h-3 w-3" />
    return null
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/hotels/${hotel.id}`} className="block">
        {/* Hotel Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              hotel.image_url ||
              `/placeholder.svg?height=300&width=400&query=${hotel.name || "/placeholder.svg"} luxury hotel resort`
            }
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {getPriceRangeDescription(hotel.price_range)}
          </div>
        </div>

        {/* Hotel Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-lg font-semibold text-gray-900 line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center gap-1 ml-2">{renderStars(hotel.rating)}</div>
          </div>

          <p className="text-sm text-gray-600 mb-2">{hotel.islands.location}</p>

          <p className="text-sm text-gray-700 line-clamp-2 mb-3">{hotel.description}</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
              >
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {hotel.amenities.length > 3 && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                +{hotel.amenities.length - 3} more
              </div>
            )}
          </div>

          {/* Moved price display inside the Link */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">${hotel.price_per_night}</span>
              <span className="text-sm text-gray-600 ml-1">/ night</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <a
          href={hotel.booking_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center block"
          onClick={(e) => e.stopPropagation()}
        >
          Book Now
        </a>
      </div>
    </div>
  )
}
