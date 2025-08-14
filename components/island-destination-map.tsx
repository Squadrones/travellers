import type { Island, Destination } from "@/lib/types"
import InteractiveMap from "./interactive-map"

interface IslandDestinationMapProps {
  island: Island
  destinations: Destination[]
}

export default function IslandDestinationMap({ island, destinations }: IslandDestinationMapProps) {
  if (!island.coordinates) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore {island.name}</h2>
          <p className="text-xl text-gray-600">
            Discover all the amazing destinations and attractions across the island
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <InteractiveMap
            islands={[island]}
            destinations={destinations}
            center={[island.coordinates.lat, island.coordinates.lng]}
            zoom={10}
            height="600px"
            showIslandMarkers={true}
            showDestinationMarkers={true}
          />
        </div>

        {/* Map Legend */}
        <div className="mt-8 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm">
                🏝️
              </div>
              <span className="text-sm text-gray-600">Island</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs">
                🏖️
              </div>
              <span className="text-sm text-gray-600">Beach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs">
                🏛️
              </div>
              <span className="text-sm text-gray-600">Landmark</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs">
                🍽️
              </div>
              <span className="text-sm text-gray-600">Restaurant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs">
                🎯
              </div>
              <span className="text-sm text-gray-600">Activity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
