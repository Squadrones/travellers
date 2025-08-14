"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Play, MapPin, Clock, Star } from "lucide-react"
import EnhancedVirtualTourModal from "./enhanced-virtual-tour-modal"
import { createClient } from "@/lib/supabase/client"
import type { Island, Destination } from "@/lib/types"

interface VirtualTour {
  id: string
  title: string
  location: string
  thumbnail: string
  panoramaUrl: string
  description: string
  island?: Island
  destinations?: Destination[]
  duration: string
  rating: number
  category: string
}

export default function EnhancedVirtualTours() {
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [islands, setIslands] = useState<Island[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  // Static virtual tours data with enhanced information
  const virtualTours: VirtualTour[] = [
    {
      id: "1",
      title: "Sunset Beach Paradise",
      location: "Maldives",
      thumbnail: "/maldives-sunset-beach-aerial.png",
      panoramaUrl: "/maldives-sunset-panorama.png",
      description:
        "Experience the breathtaking sunset views from pristine white sand beaches with crystal-clear turquoise waters",
      duration: "8 min",
      rating: 4.9,
      category: "Beach Experience",
    },
    {
      id: "2",
      title: "Crystal Lagoon Adventure",
      location: "Bora Bora",
      thumbnail: "/bora-bora-lagoon-aerial.png",
      panoramaUrl: "/bora-bora-lagoon-panoramic.png",
      description: "Dive into the crystal-clear waters of tropical lagoons surrounded by lush volcanic peaks",
      duration: "12 min",
      rating: 4.8,
      category: "Lagoon Tour",
    },
    {
      id: "3",
      title: "Mountain Peak Vista",
      location: "Santorini",
      thumbnail: "/santorini-peak-ocean.png",
      panoramaUrl: "/santorini-peak-panorama.png",
      description: "Witness panoramic views from the highest peaks with stunning ocean vistas and dramatic cliffs",
      duration: "6 min",
      rating: 4.7,
      category: "Mountain View",
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      try {
        // Fetch islands
        const { data: islandsData } = await supabase.from("islands").select("*").eq("featured", true).limit(5)

        // Fetch destinations
        const { data: destinationsData } = await supabase.from("destinations").select("*").limit(10)

        if (islandsData) setIslands(islandsData)
        if (destinationsData) setDestinations(destinationsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTourSelect = (tour: VirtualTour) => {
    // Find matching island and destinations for the tour
    const matchingIsland = islands.find((island) => island.location.toLowerCase().includes(tour.location.toLowerCase()))

    const matchingDestinations = destinations.filter((dest) => dest.island_id === matchingIsland?.id)

    const enhancedTour = {
      ...tour,
      island: matchingIsland,
      destinations: matchingDestinations,
    }

    setSelectedTour(enhancedTour)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTour(null)
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <Star className="h-4 w-4" />
            Premium Virtual Experiences
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            360° Virtual Tours
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Immerse yourself in breathtaking 360-degree experiences of our most stunning destinations. Explore paradise
            from every angle with our premium virtual reality tours.
          </p>
        </div>

        {/* Enhanced Tour Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {virtualTours.map((tour, index) => (
            <Card
              key={tour.id}
              className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0"
              onClick={() => handleTourSelect(tour)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={tour.thumbnail || `/placeholder.svg?height=300&width=400&query=${tour.title} virtual tour`}
                  alt={tour.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="h-8 w-8 sm:h-12 sm:w-12 text-white fill-white" />
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  360° VR
                </div>

                {/* Rating badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {tour.rating}
                </div>
              </div>

              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold mb-2">
                  <MapPin className="h-4 w-4" />
                  {tour.location}
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-amber-600 transition-colors duration-300 leading-tight">
                  {tour.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">{tour.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="h-4 w-4" />
                    {tour.duration}
                  </div>

                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {tour.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-amber-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready for Your Virtual Adventure?
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Experience the magic of our islands through cutting-edge 360° technology. Each tour includes interactive
              maps, destination highlights, and immersive storytelling.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Interactive Maps
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                4K Resolution
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Mobile Optimized
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Virtual Tour Modal */}
        {selectedTour && (
          <EnhancedVirtualTourModal
            isOpen={isModalOpen}
            onClose={closeModal}
            panoramaUrl={selectedTour.panoramaUrl}
            title={selectedTour.title}
            description={selectedTour.description}
            island={selectedTour.island}
            destinations={selectedTour.destinations}
            autoRotate={true}
          />
        )}
      </div>
    </section>
  )
}
