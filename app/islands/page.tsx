import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Users, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "All Islands - Island Paradise",
  description: "Discover all our beautiful island destinations with unique experiences and adventures.",
}

async function getAllIslands() {
  const supabase = createClient()
  const { data: islands, error } = await supabase.from("islands").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching islands:", error)
    return []
  }

  return islands || []
}

export default async function IslandsPage() {
  const islands = await getAllIslands()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-violet-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Our{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Paradise Islands
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            From pristine beaches to volcanic wonders, explore our collection of breathtaking island destinations. Each
            island offers unique experiences, cultures, and adventures waiting to be discovered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <MapPin className="mr-2 h-5 w-5" />
              View on Map
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-violet-200 text-violet-700 hover:bg-violet-50 bg-transparent"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Plan Your Trip
            </Button>
          </div>
        </div>
      </section>

      {/* Islands Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {islands.map((island) => (
              <div
                key={island.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Island Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={
                      island.image_url ||
                      `/placeholder.svg?height=256&width=400&query=${island.name} tropical island paradise`
                    }
                    alt={island.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {island.region}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{island.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Island Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                    {island.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{island.short_description || island.description}</p>

                  {/* Island Stats */}
                  <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{island.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{island.population || "Remote"}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link href={`/islands/${island.slug}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                        Explore Island
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-violet-200 text-violet-700 hover:bg-violet-50 bg-transparent"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {islands.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-100 to-violet-100 rounded-full flex items-center justify-center">
                <MapPin className="h-12 w-12 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Islands Found</h3>
              <p className="text-gray-600 mb-6">
                We're working on adding more amazing destinations for you to explore.
              </p>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                Check Back Soon
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
