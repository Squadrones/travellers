import { createClient } from "@/lib/supabase/server"
import InteractiveMap from "./interactive-map"

export default async function WorldMap() {
  const supabase = createClient()

  const { data: islands, error } = await supabase.from("islands").select("*").eq("featured", true).order("name")

  if (error) {
    console.error("Error fetching islands for map:", error)
    return <div>Error loading map</div>
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Island Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click on any island marker to discover more about these incredible destinations around the world
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <InteractiveMap
            islands={islands || []}
            center={[20.0, 0.0]}
            zoom={2}
            height="500px"
            showIslandMarkers={true}
            showDestinationMarkers={false}
          />
        </div>

        {/* Map Legend */}
        <div className="mt-8 flex justify-center">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm">
                🏝️
              </div>
              <span className="text-sm text-gray-600">Featured Islands</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
