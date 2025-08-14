import Navigation from "@/components/navigation"
import EnhancedHero from "@/components/enhanced-hero"
import FeaturedIslands from "@/components/featured-islands"
import EnhancedVirtualTours from "@/components/enhanced-virtual-tours"
import WorldMap from "@/components/world-map"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <EnhancedHero />
      <FeaturedIslands />
      <EnhancedVirtualTours />
      <WorldMap />
    </main>
  )
}
