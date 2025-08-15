import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign } from "lucide-react"

interface RelatedEventsProps {
  events: Array<{
    id: number
    title: string
    slug: string
    description: string
    image_url: string
    start_date: string
    start_time: string
    price: number
    event_type: string
    islands: {
      name: string
      slug: string
    }
  }>
}

export default function RelatedEvents({ events }: RelatedEventsProps) {
  if (events.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ocean-800 mb-4">More Events You Might Like</h2>
          <p className="text-ocean-600 max-w-2xl mx-auto">
            Discover other amazing experiences happening on the same island
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 border-ocean-200">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={event.image_url || "/placeholder.svg?height=300&width=400"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-ocean-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {event.event_type}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-ocean-800 mb-2 group-hover:text-ocean-600 transition-colors">
                  {event.title}
                </h3>

                <p className="text-ocean-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-ocean-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.start_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-ocean-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.islands?.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-ocean-500">
                    <DollarSign className="w-4 h-4" />
                    <span>${event.price} per person</span>
                  </div>
                </div>

                <Link href={`/events/${event.slug}`}>
                  <Button className="w-full bg-ocean-500 hover:bg-ocean-600 text-white">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
