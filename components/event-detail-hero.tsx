import Image from "next/image"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EventDetailHeroProps {
  event: {
    id: number
    title: string
    description: string
    image_url: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    location: string
    event_type: string
    max_participants: number
    price: number
    islands: {
      name: string
      slug: string
      location: string
    }
  }
}

export default function EventDetailHero({ event }: EventDetailHeroProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={event.image_url || "/placeholder.svg?height=800&width=1200"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2 bg-ocean-primary/20 text-ocean-100 border-ocean-400">
            {event.event_type}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-ocean-100 bg-clip-text text-transparent">
          {event.title}
        </h1>

        <p className="text-lg md:text-xl mb-8 text-ocean-100 max-w-2xl mx-auto">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <Calendar className="w-4 h-4 text-ocean-300" />
            <span>{formatDate(event.start_date)}</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <Clock className="w-4 h-4 text-ocean-300" />
            <span>
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <MapPin className="w-4 h-4 text-ocean-300" />
            <span>{event.islands?.name}</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <Users className="w-4 h-4 text-ocean-300" />
            <span>Max {event.max_participants} guests</span>
          </div>
        </div>
      </div>
    </section>
  )
}
