import Link from "next/link"
import type { Island } from "@/lib/types"
import { MapPin, Users, Calendar } from "lucide-react"

interface IslandCardProps {
  island: Island
}

export default function IslandCard({ island }: IslandCardProps) {
  return (
    <Link href={`/islands/${island.slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg island-card-hover cursor-pointer">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={
              island.main_image_url ||
              `/placeholder.svg?height=400&width=600&query=${island.name} tropical island paradise`
            }
            alt={island.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Island Name Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-2">{island.name}</h3>
            <div className="flex items-center text-white/90">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{island.location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4 leading-relaxed">{island.short_description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{island.population?.toLocaleString()} people</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{island.best_time_to_visit}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-2 mb-4">
            {island.languages?.slice(0, 2).map((language, index) => (
              <span key={index} className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                {language}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-lg font-semibold transition-colors duration-300">
            Explore {island.name}
          </button>
        </div>
      </div>
    </Link>
  )
}
