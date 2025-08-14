"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MapSearchProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: string[]) => void
}

export default function MapSearch({ onSearch, onFilterChange }: MapSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filterOptions = [
    { id: "beach", label: "Beaches", icon: "🏖️" },
    { id: "landmark", label: "Landmarks", icon: "🏛️" },
    { id: "restaurant", label: "Restaurants", icon: "🍽️" },
    { id: "hotel", label: "Hotels", icon: "🏨" },
    { id: "activity", label: "Activities", icon: "🎯" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((f) => f !== filterId)
      : [...activeFilters, filterId]

    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search destinations, islands, or activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
          <MapPin className="h-4 w-4 mr-2" />
          Find
        </Button>
      </form>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 mr-4">
          <Filter className="h-4 w-4" />
          <span>Filter by:</span>
        </div>
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleFilter(option.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilters.includes(option.id)
                ? "bg-violet-100 text-violet-700 border border-violet-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {activeFilters.map((filterId) => {
              const option = filterOptions.find((opt) => opt.id === filterId)
              return (
                <span
                  key={filterId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs"
                >
                  {option?.icon} {option?.label}
                </span>
              )
            })}
            <button
              onClick={() => {
                setActiveFilters([])
                onFilterChange?.([])
              }}
              className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
