"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, MapPin } from "lucide-react"

export default function EnhancedHero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('/tropical-island-paradise.png')`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className={`smooth-fade-in ${isVisible ? "opacity-100" : ""}`}>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Escape to
            <span className="block text-amber-400">Paradise</span>
          </h1>
        </div>

        <div className={`smooth-fade-in delay-1 ${isVisible ? "opacity-100" : ""}`}>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed px-2">
            Embark on virtual journeys to the world's most breathtaking islands. Explore cultures, discover hidden gems,
            and plan your next adventure.
          </p>
        </div>

        <div className={`smooth-fade-in delay-2 ${isVisible ? "opacity-100" : ""}`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Button
              size="lg"
              className="button-hover bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px] w-full sm:w-auto"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Explore Islands
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="button-hover glass-effect text-white border-white/30 hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-transparent min-h-[48px] w-full sm:w-auto"
            >
              <Play className="mr-2 h-5 w-5" />
              Virtual Tours
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className={`smooth-fade-in delay-3 ${isVisible ? "opacity-100" : ""}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4">
            <div className="stat-counter text-center glass-effect rounded-lg p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">10+</div>
              <div className="text-sm md:text-base text-gray-200">Islands</div>
            </div>
            <div
              className="stat-counter text-center glass-effect rounded-lg p-4 sm:p-6"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">50+</div>
              <div className="text-sm md:text-base text-gray-200">Destinations</div>
            </div>
            <div
              className="stat-counter text-center glass-effect rounded-lg p-4 sm:p-6"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-1 sm:mb-2">100+</div>
              <div className="text-sm md:text-base text-gray-200">Virtual Tours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
