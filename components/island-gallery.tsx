"use client"

import { useState } from "react"
import type { Island } from "@/lib/types"
import { X } from "lucide-react"

interface IslandGalleryProps {
  island: Island
}

export default function IslandGallery({ island }: IslandGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Create a gallery with main image and additional images
  const galleryImages = [
    island.main_image_url || `/placeholder.svg?height=600&width=800&query=${island.name} main view`,
    ...(island.gallery_images || [
      `/placeholder.svg?height=600&width=800&query=${island.name} beach sunset`,
      `/placeholder.svg?height=600&width=800&query=${island.name} cultural site`,
      `/placeholder.svg?height=600&width=800&query=${island.name} local cuisine`,
      `/placeholder.svg?height=600&width=800&query=${island.name} aerial landscape`,
      `/placeholder.svg?height=600&width=800&query=${island.name} underwater coral reef`,
    ]),
  ].filter(Boolean)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h2>
          <p className="text-xl text-gray-600">
            Immerse yourself in the beauty of {island.name} through these stunning visuals
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${island.name} gallery image ${index + 1}`}
                className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                  index === 0 ? "h-96 sm:h-full" : "h-48"
                }`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Gallery image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
