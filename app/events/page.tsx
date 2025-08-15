import { createClient } from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import EventsHero from "@/components/events-hero"
import EventsListing from "@/components/events-listing"
import EventsCalendar from "@/components/events-calendar"

export const metadata = {
  title: "Island Events - Festivals, Concerts & Cultural Experiences",
  description: "Discover amazing events, festivals, and cultural experiences across our featured island destinations.",
}

export default async function EventsPage() {
  const supabase = createClient()

  // Fetch all events with island information
  const { data: events, error } = await supabase
    .from("events")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
  }

  // Fetch featured events
  const { data: featuredEvents, error: featuredError } = await supabase
    .from("events")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .eq("featured", true)
    .order("start_date", { ascending: true })
    .limit(6)

  if (featuredError) {
    console.error("Error fetching featured events:", featuredError)
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <EventsHero featuredEvents={featuredEvents || []} />
      <EventsListing events={events || []} />
      <EventsCalendar events={events || []} />
    </main>
  )
}
