"use client"

import { useState, useMemo } from "react"
import type { Hotel } from "@/lib/types"
import HotelCard from "./hotel-card"
import HotelFilters from "./hotel-filters"

interface HotelsListingProps {
  hotels: (Hotel & { islands: { name: string; slug: string; location: string } })[]
}

export default function HotelsListing({ hotels }: HotelsListingProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStarRatings, setSelectedStarRatings] = useState<number[]>([])
  const [selectedIslands, setSelectedIslands] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"rating" | "price" | "stars">("rating")

  const filteredAndSortedHotels = useMemo(() => {
    const filtered = hotels.filter((hotel) => {
      // Search query filter
      if (
        searchQuery &&
        !hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !hotel.islands.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Star rating filter
      if (selectedStarRatings.length > 0 && !selectedStarRatings.includes(hotel.star_rating)) {
        return false
      }

      // Island filter
      if (selectedIslands.length > 0 && !selectedIslands.includes(hotel.islands.slug)) {
        return false
      }

      // Price range filter
      if (selectedPriceRanges.length > 0 && !selectedPriceRanges.includes(hotel.price_range)) {
        return false
      }

      // Amenities filter
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) => hotel.amenities?.some((hotelAmenity) => hotelAmenity.includes(amenity)))
      ) {
        return false
      }

      return true
    })

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "stars":
          return b.star_rating - a.star_rating
        case "price":
          const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 }
          return (
            (priceOrder[a.price_range as keyof typeof priceOrder] || 0) -
            (priceOrder[b.price_range as keyof typeof priceOrder] || 0)
          )
        default:
          return 0
      }
    })

    return filtered
  }, [hotels, searchQuery, selectedStarRatings, selectedIslands, selectedPriceRanges, selectedAmenities, sortBy])

  // Get unique values for filters
  const starRatings = [...new Set(hotels.map((hotel) => hotel.star_rating))].sort((a, b) => b - a)
  const islands = [...new Set(hotels.map((hotel) => ({ slug: hotel.islands.slug, name: hotel.islands.name })))]
  const priceRanges = [...new Set(hotels.map((hotel) => hotel.price_range))]
  const allAmenities = [...new Set(hotels.flatMap((hotel) => hotel.amenities || []))]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Stay</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover luxury resorts, boutique hotels, and charming accommodations across our island destinations
          </p>
        </div>

        {/* Filters */}
        <HotelFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStarRatings={selectedStarRatings}
          onStarRatingsChange={setSelectedStarRatings}
          selectedIslands={selectedIslands}
          onIslandsChange={setSelectedIslands}
          selectedPriceRanges={selectedPriceRanges}
          onPriceRangesChange={setSelectedPriceRanges}
          selectedAmenities={selectedAmenities}
          onAmenitiesChange={setSelectedAmenities}
          sortBy={sortBy}
          onSortChange={setSortBy}
          starRatings={starRatings}
          islands={islands}
          priceRanges={priceRanges}
          amenities={allAmenities}
        />

        {/* Results Count */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredAndSortedHotels.length} of {hotels.length} hotels
          </p>
          <div className="text-sm text-gray-500">
            Sorted by {sortBy === "rating" ? "Guest Rating" : sortBy === "stars" ? "Star Rating" : "Price"}
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredAndSortedHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Hotels Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to find more accommodations</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedStarRatings([])
                setSelectedIslands([])
                setSelectedPriceRanges([])
                setSelectedAmenities([])
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
