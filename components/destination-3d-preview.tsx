"use client"

import { useState } from "react"
import type { Destination } from "@/lib/types"
import VirtualTourViewer from "./virtual-tour-viewer"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

interface Destination3DPreviewProps {
  destination: Destination
}

export default function Destination3DPreview({ destination }: Destination3DPreviewProps) {
  const [showVirtualTour, setShowVirtualTour] = useState(false)

  const panoramaUrl = `/placeholder.svg?height=1024&width=2048&query=${destination.name} ${destination.type} 360 panorama`

  return (
    <>
      {/* 3D Preview Button */}
      <Button
        onClick={() => setShowVirtualTour(true)}
        className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white"
      >
        <Play className="h-4 w-4 mr-2" />
        Virtual Tour
      </Button>

      {/* Virtual Tour Modal */}
      {showVirtualTour && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setShowVirtualTour(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Virtual Tour Viewer */}
            <VirtualTourViewer
              panoramaUrl={panoramaUrl}
              title={`Virtual Tour: ${destination.name}`}
              description={destination.description}
              height="80vh"
              autoRotate={true}
              showControls={true}
            />
          </div>
        </div>
      )}
    </>
  )
}
