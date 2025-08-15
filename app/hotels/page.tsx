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

  // Fetch all hotels
  const { data: hotels, error } = await supabase
    .from("hotels")
    .select("*")
    .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching hotels:", error)
  }

  // Fetch islands data separately
  const { data: islands, error: islandsError } = await supabase
    .from("islands")
    .select("id, name, slug, location")

  if (islandsError) {
    console.error("Error fetching islands:", islandsError)
  }

  // Combine hotels with island data
  const hotelsWithIslands = hotels?.map((hotel: any) => ({
    ...hotel,
    islands: islands?.find((island: any) => island.id === hotel.island_id) || null
  })) || []

  // Fetch featured hotels (4+ star rating)
  const { data: featuredHotels, error: featuredError } = await supabase
    .from("hotels")
    .select("*")
    .gte("star_rating", 4)
    .order("rating", { ascending: false })
    .limit(6)

  if (featuredError) {
    console.error("Error fetching featured hotels:", featuredError)
  }

  // Combine featured hotels with island data
  const featuredHotelsWithIslands = featuredHotels?.map((hotel: any) => ({
    ...hotel,
    islands: islands?.find((island: any) => island.id === hotel.island_id) || null
  })) || []


  return (
    <main className="min-h-screen">
      <Navigation />
      <HotelsHero featuredHotels={featuredHotelsWithIslands} />
      <HotelsListing hotels={hotelsWithIslands} />
    </main>
  )
}
