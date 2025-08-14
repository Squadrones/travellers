import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient">
      {/* Background Image */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: `url('/tropical-island-paradise.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-violet-500/10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-cyan-600" />
          <span className="text-cyan-600 font-medium">Discover Paradise</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Escape to Paradise:
          <br />
          <span className="text-cyan-300">Discover Your Next</span>
          <br />
          Island Adventure
        </h1>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore our handpicked tropical destinations that promise unforgettable experiences. From pristine beaches to
          vibrant cultures, find your perfect island escape.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg font-semibold group transition-all duration-300 hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
          >
            View Destinations
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-white/80">Islands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/80">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">25+</div>
            <div className="text-white/80">Countries</div>
          </div>
        </div>
      </div>
    </section>
  )
}
