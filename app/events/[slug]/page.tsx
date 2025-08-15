import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Navigation from "@/components/navigation"
import EventDetailHero from "@/components/event-detail-hero"
import EventDetailInfo from "@/components/event-detail-info"
import EventBookingSection from "@/components/event-booking-section"
import RelatedEvents from "@/components/related-events"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: event } = await supabase
    .from("events")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .eq("id", params.slug)
    .single()

  if (!event) {
    return {
      title: "Event Not Found",
    }
  }

  return {
    title: `${event.title} - ${event.islands?.name || "Island Event"}`,
    description: event.description || `Join us for ${event.title} on ${event.islands?.name}`,
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  // Fetch the specific event
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .eq("id", params.slug)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch related events from the same island
  const { data: relatedEvents } = await supabase
    .from("events")
    .select(`
      *,
      islands (
        name,
        slug,
        location
      )
    `)
    .eq("island_id", event.island_id)
    .neq("id", event.id)
    .gte("start_date", new Date().toISOString().split("T")[0])
    .order("start_date", { ascending: true })
    .limit(3)

  return (
    <main className="min-h-screen">
      <Navigation />
      <EventDetailHero event={event} />
      <EventDetailInfo event={event} />
      <EventBookingSection event={event} />
      <RelatedEvents events={relatedEvents || []} />
    </main>
  )
}
