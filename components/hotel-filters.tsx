"use client"

import { Search, Filter, Star, MapPin, DollarSign, Wifi } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HotelFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedStarRatings: number[]
  onStarRatingsChange: (ratings: number[]) => void
  selectedIslands: string[]
  onIslandsChange: (islands: string[]) => void
  selectedPriceRanges: string[]
  onPriceRangesChange: (ranges: string[]) => void
  selectedAmenities: string[]
  onAmenitiesChange: (amenities: string[]) => void
  sortBy: "rating" | "price" | "stars"
  onSortChange: (sort: "rating" | "price" | "stars") => void
  starRatings: number[]
  islands: { slug: string; name: string }[]
  priceRanges: string[]
  amenities: string[]
}

export default function HotelFilters({
  searchQuery,
  onSearchChange,
  selectedStarRatings,
  onStarRatingsChange,
  selectedIslands,
  onIslandsChange,
  selectedPriceRanges,
  onPriceRangesChange,
  selectedAmenities,
  onAmenitiesChange,
  sortBy,
  onSortChange,
  starRatings,
  islands,
  priceRanges,
  amenities,
}: HotelFiltersProps) {
  const toggleStarRating = (rating: number) => {
    if (selectedStarRatings.includes(rating)) {
      onStarRatingsChange(selectedStarRatings.filter((r) => r !== rating))
    } else {
      onStarRatingsChange([...selectedStarRatings, rating])
    }
  }

  const toggleIsland = (island: string) => {
    if (selectedIslands.includes(island)) {
      onIslandsChange(selectedIslands.filter((i) => i !== island))
    } else {
      onIslandsChange([...selectedIslands, island])
    }
  }

  const togglePriceRange = (range: string) => {
    if (selectedPriceRanges.includes(range)) {
      onPriceRangesChange(selectedPriceRanges.filter((r) => r !== range))
    } else {
      onPriceRangesChange([...selectedPriceRanges, range])
    }
  }

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onAmenitiesChange(selectedAmenities.filter((a) => a !== amenity))
    } else {
      onAmenitiesChange([...selectedAmenities, amenity])
    }
  }

  const clearAllFilters = () => {
    onSearchChange("")
    onStarRatingsChange([])
    onIslandsChange([])
    onPriceRangesChange([])
    onAmenitiesChange([])
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />)
  }

  const popularAmenities = [
    "Pool",
    "Spa",
    "WiFi",
    "Beach Access",
    "Restaurant",
    "Fitness Center",
    "Air Conditioning",
    "Room Service",
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Search and Sort */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search hotels, resorts, locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: "rating" | "price" | "stars") => onSortChange(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Guest Rating</SelectItem>
            <SelectItem value="stars">Star Rating</SelectItem>
            <SelectItem value="price">Price (Low to High)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Categories */}
      <div className="space-y-6">
        {/* Star Ratings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Star Rating</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {starRatings.map((rating) => (
              <button
                key={rating}
                onClick={() => toggleStarRating(rating)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStarRatings.includes(rating)
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex">{renderStars(rating)}</div>
                <span>
                  {rating} Star{rating > 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Islands */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Island</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {islands.map((island) => (
              <button
                key={island.slug}
                onClick={() => toggleIsland(island.slug)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedIslands.includes(island.slug)
                    ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {island.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Price Range</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range}
                onClick={() => togglePriceRange(range)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPriceRanges.includes(range)
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Amenities */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Popular Amenities</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularAmenities.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? "bg-violet-100 text-violet-700 border border-violet-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {(selectedStarRatings.length > 0 ||
        selectedIslands.length > 0 ||
        selectedPriceRanges.length > 0 ||
        selectedAmenities.length > 0 ||
        searchQuery) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                {selectedStarRatings.length +
                  selectedIslands.length +
                  selectedPriceRanges.length +
                  selectedAmenities.length +
                  (searchQuery ? 1 : 0)}{" "}
                active filters
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
