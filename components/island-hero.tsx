import type { Island } from "@/lib/types"
import { MapPin, Users, Calendar, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IslandHeroProps {
  island: Island
}

export default function IslandHero({ island }: IslandHeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: `url(${
            island.main_image_url ||
            `/placeholder.svg?height=800&width=1200&query=${island.name} tropical island aerial view`
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-cyan-300" />
          <span className="text-cyan-300 font-medium">{island.location}</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">{island.name}</h1>

        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">{island.short_description}</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-lg font-semibold">{island.population?.toLocaleString()}</div>
            <div className="text-sm text-white/80">Population</div>
          </div>
          <div className="text-center">
            <Globe className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-lg font-semibold">{island.area_km2} km²</div>
            <div className="text-sm text-white/80">Area</div>
          </div>
          <div className="text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-lg font-semibold">{island.best_time_to_visit}</div>
            <div className="text-sm text-white/80">Best Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-lg font-semibold">{island.currency}</div>
            <div className="text-sm text-white/80">Currency</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg font-semibold">
            Plan Your Visit
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
          >
            View Hotels
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
