import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Compass } from "lucide-react"

export function TripPlanningHero() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-ocean-50 to-cyan-50 dark:from-ocean-950 dark:to-cyan-950">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-ocean-900 dark:text-ocean-100 mb-6">
            Plan Your Perfect
            <span className="hero-text block mt-2">Island Adventure</span>
          </h1>
          <p className="text-xl text-ocean-700 dark:text-ocean-300 max-w-3xl mx-auto leading-relaxed">
            Craft your dream getaway step by step. From island selection to activity booking, we'll help you create
            unforgettable memories in paradise.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button className="ocean-button text-lg px-8 py-4" variant="default">
            <Compass className="w-5 h-5 mr-2" />
            Start Planning
          </Button>
          <Button
            variant="outline"
            className="text-lg px-8 py-4 border-ocean-300 text-ocean-700 hover:bg-ocean-50 bg-transparent"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Explore Islands
          </Button>
        </div>

        {/* Planning Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-ocean-100 dark:bg-ocean-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="text-3xl font-bold text-ocean-900 dark:text-ocean-100 mb-2">5+</div>
            <div className="text-ocean-700 dark:text-ocean-300">Islands</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-ocean-100 dark:bg-ocean-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="text-3xl font-bold text-ocean-900 dark:text-ocean-100 mb-2">50+</div>
            <div className="text-ocean-700 dark:text-ocean-300">Activities</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-ocean-100 dark:bg-ocean-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="text-3xl font-bold text-ocean-900 dark:text-ocean-100 mb-2">100+</div>
            <div className="text-ocean-700 dark:text-ocean-300">Hotels</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-ocean-100 dark:bg-ocean-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="text-3xl font-bold text-ocean-900 dark:text-ocean-100 mb-2">∞</div>
            <div className="text-ocean-700 dark:text-ocean-300">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  )
}
