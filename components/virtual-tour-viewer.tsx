"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, RotateCcw, Maximize2, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

// Three.js types
declare global {
  interface Window {
    THREE: any
  }
}

interface VirtualTourViewerProps {
  panoramaUrl: string
  title: string
  description?: string
  autoRotate?: boolean
  showControls?: boolean
  height?: string
}

export default function VirtualTourViewer({
  panoramaUrl,
  title,
  description,
  autoRotate = true,
  showControls = true,
  height = "500px",
}: VirtualTourViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const sphereRef = useRef<any>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(autoRotate)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

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
      const renderer = new THREE.WebGLRenderer({ antialias: true })

      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      container.appendChild(renderer.domElement)

      // Create sphere geometry for panorama
      const geometry = new THREE.SphereGeometry(500, 60, 40)
      geometry.scale(-1, 1, 1) // Invert to see inside

      // Load panorama texture
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(
        panoramaUrl || `/placeholder.svg?height=1024&width=2048&query=${title} 360 panorama`,
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

      // Camera controls
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
      }

      const onMouseMove = (event: MouseEvent) => {
        if (!isMouseDown) return

        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY

        targetRotationX += deltaX * 0.01
        targetRotationY += deltaY * 0.01
        targetRotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationY))

        mouseX = event.clientX
        mouseY = event.clientY
      }

      const onMouseUp = () => {
        isMouseDown = false
      }

      // Touch controls for mobile
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

        targetRotationX += deltaX * 0.01
        targetRotationY += deltaY * 0.01
        targetRotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationY))

        touchStartX = touch.clientX
        touchStartY = touch.clientY
      }

      // Add event listeners
      renderer.domElement.addEventListener("mousedown", onMouseDown)
      renderer.domElement.addEventListener("mousemove", onMouseMove)
      renderer.domElement.addEventListener("mouseup", onMouseUp)
      renderer.domElement.addEventListener("touchstart", onTouchStart)
      renderer.domElement.addEventListener("touchmove", onTouchMove)

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate)

        // Smooth camera movement
        rotationX += (targetRotationX - rotationX) * 0.1
        rotationY += (targetRotationY - rotationY) * 0.1

        // Auto rotation
        if (isPlaying && !isMouseDown) {
          targetRotationX += 0.005
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
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [panoramaUrl, title])

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
      mountRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying)
    // Audio implementation would go here
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-xl">
      {/* 3D Viewer Container */}
      <div ref={mountRef} style={{ height, width: "100%" }} className="relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-lg">Loading Virtual Tour...</p>
            </div>
          </div>
        )}

        {/* Tour Info Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            {description && <p className="text-sm text-white/90">{description}</p>}
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="ghost" onClick={togglePlayPause} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button size="sm" variant="ghost" onClick={resetView} className="text-white hover:bg-white/20">
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  {hasAudio && (
                    <Button size="sm" variant="ghost" onClick={toggleAudio} className="text-white hover:bg-white/20">
                      {isAudioPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/70">Drag to look around</span>
                  <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
