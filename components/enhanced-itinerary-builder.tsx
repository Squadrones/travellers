"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Plus, Trash2, Save, Download, Users, DollarSign, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ItineraryItem {
  id: string
  type: "island" | "activity" | "hotel" | "event"
  title: string
  description: string
  day: number
  time: string
  duration: string
  location: string
  price: number
  image: string
  category?: string
  rating?: number
}

interface TripDetails {
  name: string
  startDate: string
  endDate: string
  travelers: number
  budget: number
}

export function EnhancedItineraryBuilder() {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [availableItems, setAvailableItems] = useState<ItineraryItem[]>([])
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    name: "My Island Adventure",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: 5000,
  })
  const [selectedDay, setSelectedDay] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadAvailableItems()
  }, [])

  const loadAvailableItems = async () => {
    try {
      setLoading(true)

      // Load islands
      const { data: islands } = await supabase.from("islands").select("*").limit(10)

      // Load events
      const { data: events } = await supabase.from("events").select("*").limit(20)

      // Load hotels
      const { data: hotels } = await supabase.from("hotels").select("*").limit(15)

      const items: ItineraryItem[] = []

      // Convert islands to itinerary items
      if (islands) {
        islands.forEach((island) => {
          items.push({
            id: `island-${island.id}`,
            type: "island",
            title: `Explore ${island.name}`,
            description: island.description || `Discover the beauty of ${island.name}`,
            day: 1,
            time: "09:00",
            duration: "Full Day",
            location: island.name,
            price: 0,
            image: island.image_url || "/placeholder.svg",
            category: "destination",
            rating: 4.8,
          })
        })
      }

      // Convert events to itinerary items
      if (events) {
        events.forEach((event) => {
          items.push({
            id: `event-${event.id}`,
            type: "event",
            title: event.title,
            description: event.description,
            day: 1,
            time: event.start_time || "10:00",
            duration: "3 hours",
            location: event.location,
            price: event.price || 0,
            image: event.image_url || "/placeholder.svg",
            category: event.type?.toLowerCase() || "activity",
            rating: 4.5,
          })
        })
      }

      // Convert hotels to itinerary items
      if (hotels) {
        hotels.forEach((hotel) => {
          items.push({
            id: `hotel-${hotel.id}`,
            type: "hotel",
            title: hotel.name,
            description: hotel.description || `Stay at ${hotel.name}`,
            day: 1,
            time: "15:00",
            duration: "Overnight",
            location: hotel.location,
            price: hotel.price_per_night || 200,
            image: hotel.image_url || "/placeholder.svg",
            category: "accommodation",
            rating: hotel.rating || 4.0,
          })
        })
      }

      setAvailableItems(items)
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToItinerary = (item: ItineraryItem) => {
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      day: selectedDay,
    }
    setItinerary([...itinerary, newItem])
  }

  const removeFromItinerary = (id: string) => {
    setItinerary(itinerary.filter((item) => item.id !== id))
  }

  const moveItemToDay = (itemId: string, newDay: number) => {
    setItinerary(itinerary.map((item) => (item.id === itemId ? { ...item, day: newDay } : item)))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "island":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "event":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "hotel":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
      case "activity":
        return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch =
      (item.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalCost = itinerary.reduce((sum, item) => sum + item.price, 0)
  const totalDays =
    tripDetails.startDate && tripDetails.endDate
      ? Math.ceil(
          (new Date(tripDetails.endDate).getTime() - new Date(tripDetails.startDate).getTime()) / (1000 * 60 * 60 * 24),
        ) + 1
      : 7

  const getItemsForDay = (day: number) => {
    return itinerary.filter((item) => item.day === day).sort((a, b) => a.time.localeCompare(b.time))
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Build Your Perfect Itinerary</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create your dream island adventure with our interactive planning tools. Add destinations, activities, and
            accommodations to craft the perfect trip.
          </p>
        </div>

        {/* Trip Details */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-serif font-bold mb-6">Trip Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="trip-name">Trip Name</Label>
              <Input
                id="trip-name"
                value={tripDetails.name}
                onChange={(e) => setTripDetails({ ...tripDetails, name: e.target.value })}
                placeholder="My Island Adventure"
              />
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={tripDetails.startDate}
                onChange={(e) => setTripDetails({ ...tripDetails, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={tripDetails.endDate}
                onChange={(e) => setTripDetails({ ...tripDetails, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="travelers">Travelers</Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                value={tripDetails.travelers}
                onChange={(e) => setTripDetails({ ...tripDetails, travelers: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">
                  Total Cost: <span className="text-emerald-600">${totalCost}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">{totalDays} Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">{tripDetails.travelers} Travelers</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Trip
              </Button>
              <Button size="sm" className="ocean-button">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Available Items */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-serif font-bold mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-emerald-600" />
                Add to Trip
              </h3>

              {/* Search and Filter */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="all">All Categories</option>
                  <option value="destination">Destinations</option>
                  <option value="activity">Activities</option>
                  <option value="accommodation">Hotels</option>
                  <option value="cultural">Cultural</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading options...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                            {item.price > 0 && (
                              <span className="text-sm font-medium text-emerald-600">${item.price}</span>
                            )}
                          </div>
                          <h4 className="font-medium text-sm mb-1 truncate">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {item.location}
                            </div>
                            <Button size="sm" onClick={() => addToItinerary(item)} className="text-xs">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Itinerary Timeline */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Your Itinerary
                </h3>
              </div>

              <Tabs value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(Number.parseInt(value))}>
                <TabsList className="grid w-full grid-cols-7 mb-6">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                    <TabsTrigger key={day} value={day.toString()} className="text-sm">
                      Day {day}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <TabsContent key={day} value={day.toString()}>
                    <div className="space-y-4">
                      {getItemsForDay(day).length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <h4 className="text-lg font-medium text-muted-foreground mb-2">Day {day} is empty</h4>
                          <p className="text-muted-foreground">
                            Add activities, destinations, or accommodations to this day.
                          </p>
                        </div>
                      ) : (
                        getItemsForDay(day).map((item, index) => (
                          <Card key={item.id} className="p-4 border-l-4 border-l-emerald-500">
                            <div className="flex items-start gap-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {item.time} • {item.duration}
                                  </span>
                                  {item.rating && <span className="text-sm text-yellow-600">★ {item.rating}</span>}
                                </div>
                                <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                                <p className="text-muted-foreground mb-3">{item.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {item.location}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {item.price > 0 && (
                                      <span className="font-medium text-emerald-600">${item.price}</span>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFromItinerary(item.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
