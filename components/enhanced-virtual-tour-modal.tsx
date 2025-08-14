"use client"

import { useEffect, useRef, useState } from "react"
import { X, Play, Pause, RotateCcw, Maximize2, Minimize2, Map, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import InteractiveMap from "./interactive-map"
import type { Island, Destination } from "@/lib/types"

// Three.js types
declare global {
  interface Window {
    THREE: any
  }
}

interface EnhancedVirtualTourModalProps {
  isOpen: boolean
  onClose: () => void
  panoramaUrl: string
  title: string
  description?: string
  island?: Island
  destinations?: Destination[]
  autoRotate?: boolean
}

export default function EnhancedVirtualTourModal({
  isOpen,
  onClose,
  panoramaUrl,
  title,
  description,
  island,
  destinations = [],
  autoRotate = true,
}: EnhancedVirtualTourModalProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const sphereRef = useRef<any>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(autoRotate)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !mountRef.current) return

    const loadThreeJS = async () => {
      if (typeof window !== "undefined" && !window.THREE) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        script.onload = initializeViewer
        document.head.appendChild(script)
      } else if (window.THREE) {
        initializeViewer()
      }
    }

    const initializeViewer = () => {
      if (!mountRef.current) return

      const THREE = window.THREE
      const container = mountRef.current
      const width = container.clientWidth
      const height = container.clientHeight

      // Scene setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0x000000, 1)
      container.appendChild(renderer.domElement)

      // Create sphere geometry for panorama
      const geometry = new THREE.SphereGeometry(500, 60, 40)
      geometry.scale(-1, 1, 1) // Invert to see inside

      // Load panorama texture
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(
        panoramaUrl || `/placeholder.svg?height=1024&width=2048&query=${title} 360 panorama tropical paradise`,
        (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture })
          const sphere = new THREE.Mesh(geometry, material)
          scene.add(sphere)
          sphereRef.current = sphere
          setIsLoading(false)
        },
        undefined,
        (error) => {
          console.error("Error loading panorama:", error)
          setIsLoading(false)
        },
      )

      // Enhanced camera controls
      let isMouseDown = false
      let mouseX = 0
      let mouseY = 0
      let targetRotationX = 0
      let targetRotationY = 0
      let rotationX = 0
      let rotationY = 0

      const onMouseDown = (event: MouseEvent) => {
        isMouseDown = true
        mouseX = event.clientX
        mouseY = event.clientY
        container.style.cursor = "grabbing"
      }

      const onMouseMove = (event: MouseEvent) => {
        if (!isMouseDown) return

        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY

        targetRotationX += deltaX * 0.008
        targetRotationY += deltaY * 0.008
        targetRotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationY))

        mouseX = event.clientX
        mouseY = event.clientY
      }

      const onMouseUp = () => {
        isMouseDown = false
        container.style.cursor = "grab"
      }

      // Enhanced touch controls
      let touchStartX = 0
      let touchStartY = 0

      const onTouchStart = (event: TouchEvent) => {
        const touch = event.touches[0]
        touchStartX = touch.clientX
        touchStartY = touch.clientY
      }

      const onTouchMove = (event: TouchEvent) => {
        event.preventDefault()
        const touch = event.touches[0]
        const deltaX = touch.clientX - touchStartX
        const deltaY = touch.clientY - touchStartY

        targetRotationX += deltaX * 0.008
        targetRotationY += deltaY * 0.008
        targetRotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationY))

        touchStartX = touch.clientX
        touchStartY = touch.clientY
      }

      // Add event listeners
      container.style.cursor = "grab"
      renderer.domElement.addEventListener("mousedown", onMouseDown)
      renderer.domElement.addEventListener("mousemove", onMouseMove)
      renderer.domElement.addEventListener("mouseup", onMouseUp)
      renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: false })
      renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false })

      // Smooth animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate)

        // Smooth camera movement with easing
        rotationX += (targetRotationX - rotationX) * 0.08
        rotationY += (targetRotationY - rotationY) * 0.08

        // Auto rotation with smooth acceleration
        if (isPlaying && !isMouseDown) {
          targetRotationX += 0.003
        }

        camera.rotation.order = "YXZ"
        camera.rotation.y = rotationX
        camera.rotation.x = rotationY

        renderer.render(scene, camera)
      }

      animate()

      // Store references
      sceneRef.current = scene
      rendererRef.current = renderer
      cameraRef.current = camera

      // Handle resize
      const handleResize = () => {
        if (!mountRef.current) return
        const newWidth = mountRef.current.clientWidth
        const newHeight = mountRef.current.clientHeight

        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        renderer.domElement.removeEventListener("mousedown", onMouseDown)
        renderer.domElement.removeEventListener("mousemove", onMouseMove)
        renderer.domElement.removeEventListener("mouseup", onMouseUp)
        renderer.domElement.removeEventListener("touchstart", onTouchStart)
        renderer.domElement.removeEventListener("touchmove", onTouchMove)
      }
    }

    loadThreeJS()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (rendererRef.current && mountRef.current && rendererRef.current.domElement.parentNode) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [isOpen, panoramaUrl, title, isPlaying])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.rotation.set(0, 0, 0)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Non-scrollable backdrop */}
      <div className="absolute inset-0 bg-black" />

      {/* Main content container */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" onClick={onClose} className="text-white hover:bg-white/20 p-2">
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                {description && <p className="text-sm text-white/80">{description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInfo(!showInfo)}
                className="text-white hover:bg-white/20"
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMap(!showMap)}
                className="text-white hover:bg-white/20"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <div ref={mountRef} className="w-full h-full">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-6"></div>
                  <p className="text-xl font-semibold">Loading Virtual Tour...</p>
                  <p className="text-sm text-white/70 mt-2">Preparing your 360° experience</p>
                </div>
              </div>
            )}
          </div>

          {/* Map Overlay - properly constrained */}
          {showMap && island && (
            <div className="absolute top-20 right-6 w-80 h-64 z-40 bg-white rounded-lg shadow-2xl overflow-hidden border border-white/20">
              <div className="w-full h-full relative">
                <div className="absolute inset-0">
                  <InteractiveMap
                    islands={[island]}
                    destinations={destinations}
                    center={island.coordinates ? [island.coordinates.lat, island.coordinates.lng] : [0, 0]}
                    zoom={12}
                    height="256px"
                    showIslandMarkers={true}
                    showDestinationMarkers={true}
                  />
                </div>
                {/* Map overlay controls */}
                <div className="absolute top-2 right-2 z-50">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowMap(false)}
                    className="bg-black/50 text-white hover:bg-black/70 p-1 h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 z-50">
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">{island.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Panel */}
          {showInfo && (
            <div className="absolute top-20 left-6 max-w-sm z-30 bg-black/60 backdrop-blur-md rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">{title}</h3>
              {description && <p className="text-sm text-white/90 mb-4 leading-relaxed">{description}</p>}
              <div className="text-xs text-white/70">
                <p>• Drag to look around</p>
                <p>• Use controls to navigate</p>
                <p>• Click map icon to see location</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20 px-4 py-2"
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>

              <Button size="sm" variant="ghost" onClick={resetView} className="text-white hover:bg-white/20 px-4 py-2">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">360° Virtual Tour</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 px-4 py-2"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
