import type { Destination } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, DollarSign, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Destination3DPreview from "./destination-3d-preview"

interface IslandDestinationsProps {
  destinations: Destination[]
}

export default function IslandDestinations({ destinations }: IslandDestinationsProps) {
  if (!destinations || destinations.length === 0) {
    return null
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "beach":
        return "🏖️"
      case "landmark":
        return "🏛️"
      case "restaurant":
        return "🍽️"
      case "hotel":
        return "🏨"
      case "activity":
        return "🎯"
      default:
        return "📍"
    }
  }

  const getPriceDisplay = (priceRange: string) => {
    const priceMap: { [key: string]: string } = {
      $: "Budget-friendly",
      $$: "Moderate",
      $$$: "Upscale",
      $$$$: "Luxury",
    }
    return priceMap[priceRange] || priceRange
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the must-visit places and experiences that make this island truly special
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <img
                  src={
                    destination.image_url ||
                    `/placeholder.svg?height=300&width=400&query=${destination.name || "/placeholder.svg"} ${destination.type}`
                  }
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {getTypeIcon(destination.type)} {destination.type}
                  </span>
                </div>
                {destination.rating && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{destination.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">View on map</span>
                  </div>
                  {destination.price_range && (
                    <div className="flex items-center text-gray-500">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="text-sm">{getPriceDisplay(destination.price_range)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Destination3DPreview destination={destination} />
                  {destination.website_url && (
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <a href={destination.website_url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
