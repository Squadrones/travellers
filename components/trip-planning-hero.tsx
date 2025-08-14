import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Compass } from "lucide-react"

export function TripPlanningHero() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-emerald-900 dark:text-emerald-100 mb-6">
            Plan Your Perfect
            <span className="hero-text block mt-2">Island Adventure</span>
          </h1>
          <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto leading-relaxed">
            Craft your dream getaway step by step. From island selection to activity booking, we'll help you create
            unforgettable memories in paradise.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button className="ocean-button text-lg px-8 py-4">
            <Compass className="w-5 h-5 mr-2" />
            Start Planning
          </Button>
          <Button
            variant="outline"
            className="text-lg px-8 py-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Explore Islands
          </Button>
        </div>

        {/* Planning Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">5+</div>
            <div className="text-emerald-700 dark:text-emerald-300">Islands</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">50+</div>
            <div className="text-emerald-700 dark:text-emerald-300">Activities</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">100+</div>
            <div className="text-emerald-700 dark:text-emerald-300">Hotels</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">∞</div>
            <div className="text-emerald-700 dark:text-emerald-300">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  )
}
