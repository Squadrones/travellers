import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Navigation from "@/components/navigation"
import IslandHero from "@/components/island-hero"
import IslandInfo from "@/components/island-info"
import IslandDestinations from "@/components/island-destinations"
import IslandDestinationMap from "@/components/island-destination-map"
import VirtualTourGallery from "@/components/virtual-tour-gallery"
import IslandGallery from "@/components/island-gallery"
import TravelGuide from "@/components/travel-guide"

interface IslandPageProps {
  params: {
    slug: string
  }
}

export default async function IslandPage({ params }: IslandPageProps) {
  const supabase = createClient()

  // Fetch island data
  const { data: island, error: islandError } = await supabase
    .from("islands")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (islandError || !island) {
    notFound()
  }

  // Fetch destinations for this island
  const { data: destinations, error: destinationsError } = await supabase
    .from("destinations")
    .select("*")
    .eq("island_id", island.id)
    .order("rating", { ascending: false })

  if (destinationsError) {
    console.error("Error fetching destinations:", destinationsError)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <IslandHero island={island} />
      <IslandInfo island={island} />
      <IslandDestinations destinations={destinations || []} />
      <IslandDestinationMap island={island} destinations={destinations || []} />
      <VirtualTourGallery island={island} />
      <IslandGallery island={island} />
      <TravelGuide island={island} />
    </main>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: IslandPageProps) {
  const supabase = createClient()

  const { data: island } = await supabase
    .from("islands")
    .select("name, short_description")
    .eq("slug", params.slug)
    .single()

  if (!island) {
    return {
      title: "Island Not Found",
    }
  }

  return {
    title: `${island.name} - Island Paradise`,
    description: island.short_description,
  }
}
