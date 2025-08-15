"use client"

import { useState, useEffect } from "react"
import type { Hotel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Wifi, Car } from "lucide-react"
import Link from "next/link"

interface HotelsHeroProps {
  featuredHotels: (Hotel & { islands: { name: string; slug: string; location: string } })[]
}

export default function HotelsHero({ featuredHotels }: HotelsHeroProps) {
  const [currentHotelIndex, setCurrentHotelIndex] = useState(0)

  useEffect(() => {
    if (featuredHotels.length > 1) {
      const interval = setInterval(() => {
        setCurrentHotelIndex((prev) => (prev + 1) % featuredHotels.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [featuredHotels.length])

  if (!featuredHotels.length) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-cyan-600 to-violet-600">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Island Hotels</h1>
          <p className="text-xl">Discover luxury accommodations in paradise</p>
        </div>
      </section>
    )
  }

  const currentHotel = featuredHotels[currentHotelIndex]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 parallax-bg transition-all duration-1000"
        style={{
          backgroundImage: `url(${
            currentHotel.image_url ||
            `/placeholder.svg?height=800&width=1200&query=${currentHotel.name} luxury hotel resort`
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex">{renderStars(currentHotel.star_rating)}</div>
          <span className="text-cyan-300 font-medium">{currentHotel.star_rating}-Star Luxury</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-center">
          {currentHotel.name}
        </h1>

        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-cyan-300" />
          <span className="text-cyan-300 font-medium">{currentHotel.islands?.name || "Location TBD"}</span>
        </div>

        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed text-center">
          {currentHotel.description}
        </p>

        {/* Hotel Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">{renderStars(currentHotel.star_rating)}</div>
            <div className="text-sm text-white/80">Star Rating</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              {currentHotel.rating}/5
            </div>
            <div className="text-sm text-white/80">{currentHotel.review_count} Reviews</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold">{currentHotel.price_range}</div>
            <div className="text-sm text-white/80">Price Range</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold">{currentHotel.amenities?.length || 0}+</div>
            <div className="text-sm text-white/80">Amenities</div>
          </div>
        </div>

        {/* Key Amenities */}
        <div className="flex justify-center gap-6 mb-8">
          {currentHotel.amenities?.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-white/90">
              {amenity.toLowerCase().includes("wifi") && <Wifi className="h-4 w-4" />}
              {amenity.toLowerCase().includes("transfer") && <Car className="h-4 w-4" />}
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={`/hotels/${currentHotel.id}`}>
            <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg font-semibold">
              View Hotel Details
            </Button>
          </Link>

          {currentHotel.booking_url && (
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
              asChild
            >
              <a href={currentHotel.booking_url} target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
          )}
        </div>

        {/* Hotel Navigation Dots */}
        {featuredHotels.length > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {featuredHotels.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHotelIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentHotelIndex ? "bg-cyan-300" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
