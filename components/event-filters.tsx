"use client"

import { Search, Filter, Calendar, MapPin, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface EventFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
  selectedIslands: string[]
  onIslandsChange: (islands: string[]) => void
  dateRange: { start: string; end: string }
  onDateRangeChange: (range: { start: string; end: string }) => void
  eventTypes: string[]
  islands: { slug: string; name: string }[]
}

export default function EventFilters({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  selectedIslands,
  onIslandsChange,
  dateRange,
  onDateRangeChange,
  eventTypes,
  islands,
}: EventFiltersProps) {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const toggleIsland = (island: string) => {
    if (selectedIslands.includes(island)) {
      onIslandsChange(selectedIslands.filter((i) => i !== island))
    } else {
      onIslandsChange([...selectedIslands, island])
    }
  }

  const clearAllFilters = () => {
    onSearchChange("")
    onTypesChange([])
    onIslandsChange([])
    onDateRangeChange({ start: "", end: "" })
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "festival":
        return "🎪"
      case "concert":
        return "🎵"
      case "cultural":
        return "🎭"
      case "sports":
        return "⚽"
      default:
        return "🎯"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search events, festivals, concerts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Categories */}
      <div className="space-y-6">
        {/* Event Types */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Event Type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTypes.includes(type)
                    ? "bg-violet-100 text-violet-700 border border-violet-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{getTypeIcon(type)}</span>
                <span className="capitalize">{type}</span>
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

        {/* Date Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Date Range</span>
          </div>
          <div className="flex gap-3">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              className="flex-1"
            />
            <span className="flex items-center text-gray-500">to</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {(selectedTypes.length > 0 || selectedIslands.length > 0 || dateRange.start || dateRange.end || searchQuery) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                {selectedTypes.length + selectedIslands.length + (dateRange.start ? 1 : 0) + (searchQuery ? 1 : 0)}{" "}
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
