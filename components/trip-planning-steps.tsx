import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Activity, Heart, Share2, Download } from "lucide-react"

const steps = [
  {
    icon: MapPin,
    title: "Choose Your Islands",
    description: "Discover your paradise—explore our stunning island destinations and select your favorites.",
    color: "text-ocean-600",
  },
  {
    icon: Calendar,
    title: "Set Your Dates",
    description: "Pick your travel dates and duration to create the perfect timeline for your adventure.",
    color: "text-ocean-600",
  },
  {
    icon: Activity,
    title: "Book Experiences",
    description: "Book unforgettable experiences tailored just for you—from diving to cultural tours.",
    color: "text-cyan-600",
  },
  {
    icon: Heart,
    title: "Get Recommendations",
    description: "Your dream trip awaits—personalized recommendations based on your preferences.",
    color: "text-ocean-700",
  },
  {
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share your itinerary with travel companions and plan together in real-time.",
    color: "text-ocean-800",
  },
  {
    icon: Download,
    title: "Export Your Plan",
    description: "Download your complete itinerary with all bookings, maps, and travel information.",
    color: "text-cyan-700",
  },
]

export function TripPlanningSteps() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Planning your island adventure is simple with our step-by-step process. From selection to booking, we guide
            you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="island-card p-8 text-center group" about='Trip Planning Step'>
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-ocean-100 to-cyan-100 dark:from-ocean-800 dark:to-cyan-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <div className="w-8 h-8 bg-ocean-600 text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
