"use client"

import { useState, useMemo } from "react"
import type { Event } from "@/lib/types"
import EventCard from "./event-card"
import EventFilters from "./event-filters"

interface EventsListingProps {
  events: (Event & { islands: { name: string; slug: string; location: string } | null })[]
}

export default function EventsListing({ events }: EventsListingProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedIslands, setSelectedIslands] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search query filter
      if (
        searchQuery &&
        !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Event type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.event_type)) {
        return false
      }

      // Island filter
      if (selectedIslands.length > 0 && (!event.islands || !selectedIslands.includes(event.islands.slug))) {
        return false
      }

      // Date range filter
      if (dateRange.start && event.start_date < dateRange.start) {
        return false
      }
      if (dateRange.end && event.start_date > dateRange.end) {
        return false
      }

      return true
    })
  }, [events, searchQuery, selectedTypes, selectedIslands, dateRange])

  // Get unique event types and islands for filters
  const eventTypes = [...new Set(events.map((event) => event.event_type))]
  const islands = [
    ...new Set(
      events
        .filter((event) => event.islands)
        .map((event) => ({ slug: event.islands!.slug, name: event.islands!.name })),
    ),
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover festivals, concerts, and cultural experiences across our island destinations
          </p>
        </div>

        {/* Filters */}
        <EventFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          selectedIslands={selectedIslands}
          onIslandsChange={setSelectedIslands}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          eventTypes={eventTypes}
          islands={islands}
        />

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to find more events</p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedTypes([])
                setSelectedIslands([])
                setDateRange({ start: "", end: "" })
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
