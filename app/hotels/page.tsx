import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import HotelsHero from "@/components/hotels-hero"
import HotelsListing from "@/components/hotels-listing"

export const metadata = {
  title: "Island Hotels - Luxury Resorts & Boutique Accommodations",
  description:
    "Discover amazing hotels, resorts, and accommodations across our featured island destinations with exclusive booking deals.",
}

export default async function HotelsPage() {
  const supabase = createClient()

  // Fetch all hotels with island information
  const { data: hotels, error } = await supabase
    .from("hotels")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching hotels:", error)
  }

  // Fetch featured hotels (4+ star rating)
  const { data: featuredHotels, error: featuredError } = await supabase
    .from("hotels")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .gte("star_rating", 4)
    .order("rating", { ascending: false })
    .limit(6)

  if (featuredError) {
    console.error("Error fetching featured hotels:", featuredError)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <HotelsHero featuredHotels={featuredHotels || []} />
      <HotelsListing hotels={hotels || []} />
    </main>
  )
}
