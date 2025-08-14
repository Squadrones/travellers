"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Plus, Trash2, Edit3 } from "lucide-react"

interface ItineraryItem {
  id: string
  type: "island" | "activity" | "hotel" | "transport"
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: string
  price: number
  image: string
}

export function ItineraryBuilder() {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [selectedDay, setSelectedDay] = useState(1)

  const sampleItems: ItineraryItem[] = [
    {
      id: "1",
      type: "island",
      title: "Arrive in Santorini",
      description: "Explore the stunning caldera views and white-washed buildings",
      date: "2024-06-15",
      time: "10:00",
      duration: "4 hours",
      location: "Santorini, Greece",
      price: 0,
      image: "/santorini-peak-ocean.png",
    },
    {
      id: "2",
      type: "activity",
      title: "Sunset Wine Tasting",
      description: "Experience local wines while watching the famous Santorini sunset",
      date: "2024-06-15",
      time: "18:00",
      duration: "3 hours",
      location: "Oia, Santorini",
      price: 85,
      image: "/wine-tasting-sunset.png",
    },
  ]

  const addToItinerary = (item: ItineraryItem) => {
    setItinerary([...itinerary, { ...item, id: Date.now().toString() }])
  }

  const removeFromItinerary = (id: string) => {
    setItinerary(itinerary.filter((item) => item.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "island":
        return "bg-emerald-100 text-emerald-800"
      case "activity":
        return "bg-blue-100 text-blue-800"
      case "hotel":
        return "bg-purple-100 text-purple-800"
      case "transport":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalCost = itinerary.reduce((sum, item) => sum + item.price, 0)

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Build Your Itinerary</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Drag and drop activities, accommodations, and experiences to create your perfect island adventure timeline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Items */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-xl font-serif font-bold mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-emerald-600" />
                Available Options
              </h3>
              <div className="space-y-4">
                {sampleItems.map((item) => (
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
                        <Button size="sm" onClick={() => addToItinerary(item)} className="w-full">
                          Add to Trip
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Itinerary Timeline */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Your Itinerary
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Total: <span className="font-bold text-emerald-600">${totalCost}</span>
                  </span>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>

              {itinerary.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium text-muted-foreground mb-2">Your itinerary is empty</h4>
                  <p className="text-muted-foreground">
                    Start building your perfect trip by adding islands, activities, and accommodations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itinerary.map((item, index) => (
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
                          </div>
                          <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                          <p className="text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {item.location}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.price > 0 && <span className="font-medium text-emerald-600">${item.price}</span>}
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
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
