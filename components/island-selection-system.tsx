"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Star, Users, Search, Filter, Check, Heart, Info } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Island {
  id: number
  name: string
  description: string
  image_url: string
  location: string
  country: string
  climate: string
  languages: string[]
  currency: string
  best_time_to_visit: string
  average_temperature: string
  population: number
  area_km2: number
  rating?: number
  price_range?: string
  activities?: string[]
  highlights?: string[]
}

interface IslandSelectionProps {
  selectedIslands: Island[]
  onIslandSelect: (island: Island) => void
  onIslandDeselect: (islandId: number) => void
}

export function IslandSelectionSystem({ selectedIslands, onIslandSelect, onIslandDeselect }: IslandSelectionProps) {
  const [islands, setIslands] = useState<Island[]>([])
  const [filteredIslands, setFilteredIslands] = useState<Island[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    climate: [] as string[],
    priceRange: [] as string[],
    activities: [] as string[],
  })
  const [viewMode, setViewMode] = useState<"grid" | "comparison">("grid")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadIslands()
  }, [])

  useEffect(() => {
    filterIslands()
  }, [islands, searchTerm, selectedFilters])

  const loadIslands = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("islands").select("*")

      if (error) throw error

      // Enhance islands with additional data
      const enhancedIslands =
        data?.map((island) => ({
          ...island,
          rating: 4.2 + Math.random() * 0.6, // Random rating between 4.2-4.8
          price_range: ["Budget", "Mid-range", "Luxury"][Math.floor(Math.random() * 3)],
          activities: ["Diving", "Hiking", "Cultural Tours", "Beach Activities", "Water Sports"].slice(
            0,
            3 + Math.floor(Math.random() * 3),
          ),
          highlights: [
            "Stunning beaches",
            "Rich culture",
            "Adventure activities",
            "Local cuisine",
            "Historic sites",
            "Natural wonders",
          ].slice(0, 3 + Math.floor(Math.random() * 3)),
        })) || []

      setIslands(enhancedIslands)
    } catch (error) {
      console.error("Error loading islands:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterIslands = () => {
    let filtered = islands

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (island) =>
          island.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          island.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          island.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Climate filter
    if (selectedFilters.climate.length > 0) {
      filtered = filtered.filter((island) => selectedFilters.climate.includes(island.climate))
    }

    // Price range filter
    if (selectedFilters.priceRange.length > 0) {
      filtered = filtered.filter((island) => selectedFilters.priceRange.includes(island.price_range || ""))
    }

    // Activities filter
    if (selectedFilters.activities.length > 0) {
      filtered = filtered.filter((island) =>
        selectedFilters.activities.some((activity) => island.activities?.includes(activity)),
      )
    }

    setFilteredIslands(filtered)
  }

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string, checked: boolean) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: checked ? [...prev[filterType], value] : prev[filterType].filter((item) => item !== value),
    }))
  }

  const isIslandSelected = (islandId: number) => {
    return selectedIslands.some((island) => island.id === islandId)
  }

  const handleIslandToggle = (island: Island) => {
    if (isIslandSelected(island.id)) {
      onIslandDeselect(island.id)
    } else {
      onIslandSelect(island)
    }
  }

  const climateOptions = ["Tropical", "Mediterranean", "Temperate", "Subtropical"]
  const priceRangeOptions = ["Budget", "Mid-range", "Luxury"]
  const activityOptions = ["Diving", "Hiking", "Cultural Tours", "Beach Activities", "Water Sports", "Adventure"]

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Loading paradise destinations...</p>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Choose Your Paradise</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover stunning island destinations and select your favorites for the perfect multi-island adventure.
          </p>
        </div>

        {/* Selected Islands Summary */}
        {selectedIslands.length > 0 && (
          <Card className="p-6 mb-8 bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Selected Islands ({selectedIslands.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIslands.map((island) => (
                    <Badge
                      key={island.id}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                      onClick={() => onIslandDeselect(island.id)}
                    >
                      {island.name} ✕
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "comparison" : "grid")}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                {viewMode === "grid" ? "Compare Selected" : "Grid View"}
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search islands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Climate Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Climate</h4>
                <div className="space-y-2">
                  {climateOptions.map((climate) => (
                    <div key={climate} className="flex items-center space-x-2">
                      <Checkbox
                        id={`climate-${climate}`}
                        checked={selectedFilters.climate.includes(climate)}
                        onCheckedChange={(checked) => handleFilterChange("climate", climate, checked as boolean)}
                      />
                      <label htmlFor={`climate-${climate}`} className="text-sm">
                        {climate}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRangeOptions.map((range) => (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox
                        id={`price-${range}`}
                        checked={selectedFilters.priceRange.includes(range)}
                        onCheckedChange={(checked) => handleFilterChange("priceRange", range, checked as boolean)}
                      />
                      <label htmlFor={`price-${range}`} className="text-sm">
                        {range}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Activities</h4>
                <div className="space-y-2">
                  {activityOptions.map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`activity-${activity}`}
                        checked={selectedFilters.activities.includes(activity)}
                        onCheckedChange={(checked) => handleFilterChange("activities", activity, checked as boolean)}
                      />
                      <label htmlFor={`activity-${activity}`} className="text-sm">
                        {activity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Islands Grid/Comparison */}
          <div className="lg:col-span-3">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIslands.map((island) => (
                  <Card
                    key={island.id}
                    className={`island-card cursor-pointer transition-all duration-300 ${
                      isIslandSelected(island.id)
                        ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => handleIslandToggle(island)}
                  >
                    <div className="relative">
                      <img
                        src={island.image_url || "/placeholder.svg"}
                        alt={island.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4">
                        {isIslandSelected(island.id) ? (
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-800">{island.price_range}</Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-serif font-bold">{island.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{island.rating?.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {island.country}
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{island.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Climate:</span>
                          <Badge variant="outline" className="text-xs">
                            {island.climate}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {island.activities?.slice(0, 3).map((activity) => (
                            <Badge key={activity} variant="secondary" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {(island.population / 1000).toFixed(0)}K
                            </span>
                            <span>{island.area_km2} km²</span>
                          </div>
                          <Button
                            size="sm"
                            variant={isIslandSelected(island.id) ? "default" : "outline"}
                            className={
                              isIslandSelected(island.id)
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            }
                          >
                            {isIslandSelected(island.id) ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Comparison View
              <Card className="p-6">
                <h3 className="text-xl font-serif font-bold mb-6">Compare Selected Islands</h3>
                {selectedIslands.length === 0 ? (
                  <div className="text-center py-12">
                    <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Select islands to compare their features</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Feature</th>
                          {selectedIslands.map((island) => (
                            <th key={island.id} className="text-left py-3 px-4">
                              {island.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Climate</td>
                          {selectedIslands.map((island) => (
                            <td key={island.id} className="py-3 px-4">
                              {island.climate}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Price Range</td>
                          {selectedIslands.map((island) => (
                            <td key={island.id} className="py-3 px-4">
                              {island.price_range}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Rating</td>
                          {selectedIslands.map((island) => (
                            <td key={island.id} className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                {island.rating?.toFixed(1)}
                              </div>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Population</td>
                          {selectedIslands.map((island) => (
                            <td key={island.id} className="py-3 px-4">
                              {(island.population / 1000).toFixed(0)}K
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">Top Activities</td>
                          {selectedIslands.map((island) => (
                            <td key={island.id} className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {island.activities?.slice(0, 2).map((activity) => (
                                  <Badge key={activity} variant="secondary" className="text-xs">
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            )}

            {filteredIslands.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No islands found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
