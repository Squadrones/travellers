import Link from "next/link"
import type { Event } from "@/lib/types"
import { Calendar, Clock, MapPin, Ticket, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventCardProps {
  event: Event & { islands?: { name: string; slug: string; location: string } | null }
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "festival":
        return "🎪"
      case "concert":
        return "🎵"
      case "cultural":
        return "🎭"
      case "sports":
        return "⚽"
      default:
        return "🎯"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "festival":
        return "bg-purple-100 text-purple-700"
      case "concert":
        return "bg-blue-100 text-blue-700"
      case "cultural":
        return "bg-green-100 text-green-700"
      case "sports":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            event.image_url ||
            `/placeholder.svg?height=300&width=400&query=${event.title || "/placeholder.svg"} ${event.event_type} event`
          }
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(event.event_type)}`}>
            {getTypeIcon(event.event_type)} {event.event_type}
          </span>
        </div>

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">FEATURED</span>
          </div>
        )}

        {/* Date Overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="text-2xl font-bold">{new Date(event.start_date).getDate()}</div>
          <div className="text-sm">{new Date(event.start_date).toLocaleDateString("en-US", { month: "short" })}</div>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(event.start_date)}
              {event.end_date && event.end_date !== event.start_date && ` - ${formatDate(event.end_date)}`}
            </span>
          </div>

          {event.start_time && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {event.location}
              {event.islands?.name ? `, ${event.islands.name}` : ""}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Ticket className="h-4 w-4 mr-2" />
            <span>{event.ticket_price ? `$${event.ticket_price}` : "Free"}</span>
          </div>
        </div>

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Users className="h-4 w-4 mr-2" />
            <span>Organized by {event.organizer}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/events/${event.slug}`} className="flex-1">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">View Details</Button>
          </Link>
          {event.ticket_url && (
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                Get Tickets
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
