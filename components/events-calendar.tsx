"use client"

import { useState, useMemo } from "react"
import type { Event } from "@/lib/types"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventsCalendarProps {
  events: (Event & { islands: { name: string; slug: string; location: string } })[]
}

export default function EventsCalendar({ events }: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get events for current month
  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date)
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
    })
  }, [events, currentMonth, currentYear])

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayEvents = monthEvents.filter((event) => {
        const eventDate = new Date(event.start_date)
        return eventDate.toDateString() === current.toDateString()
      })

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === currentMonth,
        events: dayEvents,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentYear, currentMonth, monthEvents])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Events Calendar</h2>
          <p className="text-xl text-gray-600">Plan your island adventures with our comprehensive events calendar</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-violet-600 text-white p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <p className="text-white/80">{monthEvents.length} events this month</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-100 ${
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${day.date.toDateString() === new Date().toDateString() ? "ring-2 ring-cyan-400" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                    {day.date.getDate()}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {day.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded bg-gradient-to-r from-cyan-100 to-violet-100 text-gray-700 truncate cursor-pointer hover:from-cyan-200 hover:to-violet-200 transition-colors"
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-xs text-gray-500">+{day.events.length - 2} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="bg-gray-50 p-6 border-t">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-100 to-violet-100 rounded"></div>
                <span>Events</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-cyan-400 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Click on events for details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
