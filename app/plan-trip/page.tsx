import { Navigation } from "@/components/navigation"
import { TripPlanningHero } from "@/components/trip-planning-hero"
import { TripPlanningSteps } from "@/components/trip-planning-steps"
import { TripPlanningWorkflow } from "@/components/trip-planning-workflow"

export default function PlanTripPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <TripPlanningHero />
      <TripPlanningSteps />
      <TripPlanningWorkflow />
    </div>
  )
}

export const metadata = {
  title: "Plan Your Trip | Lombok Island",
  description:
    "Craft your perfect island getaway with our comprehensive trip planning tools. Select islands, book activities, and create personalized itineraries.",
}
