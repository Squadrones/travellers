"use client"

import { useState } from "react"
import type { Island } from "@/lib/types"
import VirtualTourViewer from "./virtual-tour-viewer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

interface VirtualTour {
  id: string
  title: string
  description: string
  panoramaUrl: string
  thumbnailUrl: string
  location: string
}

interface VirtualTourGalleryProps {
  island: Island
}

export default function VirtualTourGallery({ island }: VirtualTourGalleryProps) {
  // Sample virtual tours - in a real app, these would come from the database
  const virtualTours: VirtualTour[] = [
    {
      id: "1",
      title: `${island.name} Beach Sunset`,
      description: "Experience the breathtaking sunset views from the pristine beaches",
      panoramaUrl: `/placeholder.svg?height=1024&width=2048&query=${island.name} beach sunset 360 panorama`,
      thumbnailUrl: `/placeholder.svg?height=300&width=400&query=${island.name} beach sunset`,
      location: "Main Beach",
    },
    {
      id: "2",
      title: `${island.name} Cultural Center`,
      description: "Explore the rich cultural heritage and traditional architecture",
      panoramaUrl: `/placeholder.svg?height=1024&width=2048&query=${island.name} cultural center 360 panorama`,
      thumbnailUrl: `/placeholder.svg?height=300&width=400&query=${island.name} cultural center`,
      location: "Cultural District",
    },
    {
      id: "3",
      title: `${island.name} Aerial View`,
      description: "Soar above the island and witness its natural beauty from the sky",
      panoramaUrl: `/placeholder.svg?height=1024&width=2048&query=${island.name} aerial view 360 panorama`,
      thumbnailUrl: `/placeholder.svg?height=300&width=400&query=${island.name} aerial view`,
      location: "Island Overview",
    },
    {
      id: "4",
      title: `${island.name} Underwater World`,
      description: "Dive into crystal-clear waters and explore vibrant coral reefs",
      panoramaUrl: `/placeholder.svg?height=1024&width=2048&query=${island.name} underwater coral reef 360 panorama`,
      thumbnailUrl: `/placeholder.svg?height=300&width=400&query=${island.name} underwater coral reef`,
      location: "Coral Gardens",
    },
  ]

  const [selectedTour, setSelectedTour] = useState<VirtualTour>(virtualTours[0])
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTour = () => {
    const nextIndex = (currentIndex + 1) % virtualTours.length
    setCurrentIndex(nextIndex)
    setSelectedTour(virtualTours[nextIndex])
  }

  const prevTour = () => {
    const prevIndex = (currentIndex - 1 + virtualTours.length) % virtualTours.length
    setCurrentIndex(prevIndex)
    setSelectedTour(virtualTours[prevIndex])
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Virtual Tours</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Immerse yourself in {island.name} with our 360-degree virtual experiences
          </p>
        </div>

        {/* Main Virtual Tour Viewer */}
        <div className="mb-8">
          <VirtualTourViewer
            panoramaUrl={selectedTour.panoramaUrl}
            title={selectedTour.title}
            description={selectedTour.description}
            height="600px"
            autoRotate={true}
            showControls={true}
          />
        </div>

        {/* Tour Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={prevTour}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Tour
          </Button>

          <div className="text-center text-white">
            <p className="text-sm text-gray-300">
              {currentIndex + 1} of {virtualTours.length}
            </p>
            <p className="font-medium">{selectedTour.location}</p>
          </div>

          <Button
            onClick={nextTour}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Next Tour
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Tour Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {virtualTours.map((tour, index) => (
            <div
              key={tour.id}
              onClick={() => {
                setSelectedTour(tour)
                setCurrentIndex(index)
              }}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                selectedTour.id === tour.id
                  ? "ring-2 ring-cyan-400 transform scale-105"
                  : "hover:transform hover:scale-105"
              }`}
            >
              <img
                src={tour.thumbnailUrl || "/placeholder.svg"}
                alt={tour.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <h4 className="text-white text-sm font-medium truncate">{tour.title}</h4>
                <p className="text-white/70 text-xs truncate">{tour.location}</p>
              </div>
              <div className="absolute top-2 right-2">
                <div className="bg-black/60 rounded-full p-1">
                  <Eye className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tour Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center text-white">
            <div className="bg-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌅</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">360° Views</h3>
            <p className="text-gray-300 text-sm">
              Experience complete panoramic views of stunning locations across the island
            </p>
          </div>

          <div className="text-center text-white">
            <div className="bg-violet-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Controls</h3>
            <p className="text-gray-300 text-sm">
              Navigate freely with mouse, touch, or keyboard controls for the perfect viewing experience
            </p>
          </div>

          <div className="text-center text-white">
            <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
            <p className="text-gray-300 text-sm">
              Enjoy seamless virtual tours on any device with responsive touch controls
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
