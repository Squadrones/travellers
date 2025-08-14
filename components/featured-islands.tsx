import { createClient } from "@/lib/supabase/server"
import type { Island } from "@/lib/types"
import IslandCard from "./island-card"

export default async function FeaturedIslands() {
  const supabase = createClient()

  const { data: islands, error } = await supabase
    .from("islands")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching islands:", error)
    return <div>Error loading islands</div>
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Island Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover breathtaking islands that offer unique experiences, from volcanic landscapes to pristine coral
            reefs. Each destination promises memories that will last a lifetime.
          </p>
        </div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {islands?.map((island: Island) => (
            <IslandCard key={island.id} island={island} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105">
            Explore All Destinations
          </button>
        </div>
      </div>
    </section>
  )
}
