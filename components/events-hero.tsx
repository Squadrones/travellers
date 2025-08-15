"use client"

import { useState, useEffect } from "react"
import type { Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Ticket } from "lucide-react"
import Link from "next/link"

interface EventsHeroProps {
  featuredEvents: (Event & { islands?: { name: string; slug: string; location: string } | null })[]
}

export default function EventsHero({ featuredEvents }: EventsHeroProps) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  useEffect(() => {
    if (featuredEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredEvents.length])

  if (!featuredEvents.length) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-cyan-600 to-violet-600">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Island Events</h1>
          <p className="text-xl">Discover amazing cultural experiences</p>
        </div>
      </section>
    )
  }

  const currentEvent = featuredEvents[currentEventIndex]

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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 parallax-bg transition-all duration-1000"
        style={{
          backgroundImage: `url(${
            currentEvent.image_url ||
            `/placeholder.svg?height=800&width=1200&query=${currentEvent.title} ${currentEvent.event_type}`
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-cyan-300" />
          <span className="text-cyan-300 font-medium">Featured Event</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{currentEvent.title}</h1>

        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">{currentEvent.description}</p>

        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-sm text-white/80">Date</div>
            <div className="font-semibold">{formatDate(currentEvent.start_date)}</div>
          </div>

          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-sm text-white/80">Time</div>
            <div className="font-semibold">
              {currentEvent.start_time ? formatTime(currentEvent.start_time) : "All Day"}
            </div>
          </div>

          <div className="text-center">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-sm text-white/80">Location</div>
            <div className="font-semibold">{currentEvent.islands?.name || "Location TBD"}</div>
          </div>

          <div className="text-center">
            <Ticket className="h-6 w-6 mx-auto mb-2 text-cyan-300" />
            <div className="text-sm text-white/80">Price</div>
            <div className="font-semibold">{currentEvent.ticket_price ? `$${currentEvent.ticket_price}` : "Free"}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={`/events/${currentEvent.slug}`}>
            <Button size="lg" className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-4 text-lg font-semibold">
              View Event Details
            </Button>
          </Link>

          {currentEvent.ticket_url && (
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent"
              asChild
            >
              <a href={currentEvent.ticket_url} target="_blank" rel="noopener noreferrer">
                Get Tickets
              </a>
            </Button>
          )}
        </div>

        {/* Event Navigation Dots */}
        {featuredEvents.length > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEventIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentEventIndex ? "bg-cyan-300" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
