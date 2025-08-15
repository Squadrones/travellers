import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEventsCount() {
  try {
    // Get total count of events
    const { count: totalEvents, error: countError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error counting events:", countError)
      return
    }

    console.log(`Total events in database: ${totalEvents}`)

    // Get some sample events to see what's available
    const { data: sampleEvents, error: sampleError } = await supabase
      .from("events")
      .select("title, event_type, start_date, location")
      .limit(5)

    if (sampleError) {
      console.error("Error fetching sample events:", sampleError)
      return
    }

    console.log("\nSample events:")
    sampleEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.event_type}) - ${event.start_date} at ${event.location}`)
    })

    // Get events by type
    const { data: eventTypes, error: typesError } = await supabase.from("events").select("event_type")

    if (!typesError && eventTypes) {
      const typeCount = eventTypes.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1
        return acc
      }, {})

      console.log("\nEvents by type:")
      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`- ${type}: ${count} events`)
      })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
  }
}

checkEventsCount()
