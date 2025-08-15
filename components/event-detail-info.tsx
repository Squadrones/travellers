import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Clock, DollarSign, Users, Info } from "lucide-react"

interface EventDetailInfoProps {
  event: {
    id: number
    title: string
    description: string
    long_description?: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    location: string
    event_type: string
    max_participants: number
    price: number
    what_to_bring?: string
    cancellation_policy?: string
    islands: {
      name: string
      slug: string
      location: string
    }
  }
}

export default function EventDetailInfo({ event }: EventDetailInfoProps) {
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
    <section className="py-16 bg-gradient-to-b from-ocean-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-ocean-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-ocean-800 flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-ocean max-w-none">
                <p className="text-ocean-700 leading-relaxed">{event.long_description || event.description}</p>
              </CardContent>
            </Card>

            {event.what_to_bring && (
              <Card className="border-ocean-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-ocean-800">What to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-ocean-700">{event.what_to_bring}</p>
                </CardContent>
              </Card>
            )}

            {event.cancellation_policy && (
              <Card className="border-ocean-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-ocean-800">Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-ocean-700">{event.cancellation_policy}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Event Details Sidebar */}
          <div className="space-y-6">
            <Card className="border-ocean-200 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl text-ocean-800">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-ocean-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-ocean-800">Date</p>
                    <p className="text-ocean-600">{formatDate(event.start_date)}</p>
                    {event.end_date !== event.start_date && (
                      <p className="text-ocean-600">to {formatDate(event.end_date)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-ocean-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-ocean-800">Time</p>
                    <p className="text-ocean-600">
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-ocean-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-ocean-800">Location</p>
                    <p className="text-ocean-600">{event.location}</p>
                    <p className="text-ocean-500 text-sm">{event.islands?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-ocean-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-ocean-800">Price</p>
                    <p className="text-ocean-600 text-lg font-semibold">${event.price} per person</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-ocean-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-ocean-800">Capacity</p>
                    <p className="text-ocean-600">Maximum {event.max_participants} participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
