"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Star,
  Search,
  Filter,
  BookOpen,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface Activity {
  id: number
  title: string
  description: string
  type: string
  location: string
  island_name: string
  price: number
  duration: string
  max_participants: number
  difficulty_level: string
  image_url: string
  start_time: string
  end_time: string
  start_date: string
  end_date: string
  rating?: number
  available_spots?: number
  includes?: string[]
  requirements?: string[]
}

interface BookingDetails {
  activityId: number
  date: Date
  timeSlot: string
  participants: number
  totalPrice: number
  customerInfo: {
    name: string
    email: string
    phone: string
  }
}

export function ActivityBookingSystem() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState({
    type: "All types",
    island: "All islands",
    priceRange: "Any price",
    difficulty: "Any level",
  })
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    activityId: 0,
    date: new Date(),
    timeSlot: "",
    participants: 1,
    totalPrice: 0,
    customerInfo: {
      name: "",
      email: "",
      phone: "",
    },
  })
  const [bookingStep, setBookingStep] = useState<"select" | "details" | "confirm">("select")
  const [loading, setLoading] = useState(true)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, searchTerm, selectedFilters])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("events").select("*")

      if (error) throw error

      // Enhance activities with additional booking data
      const enhancedActivities =
        data?.map((event) => ({
          ...event,
          rating: 4.2 + Math.random() * 0.6,
          available_spots: Math.floor(Math.random() * 20) + 5,
          max_participants: Math.floor(Math.random() * 30) + 10,
          difficulty_level: ["Easy", "Moderate", "Challenging"][Math.floor(Math.random() * 3)],
          includes: [
            "Professional guide",
            "Equipment rental",
            "Refreshments",
            "Transportation",
            "Insurance",
            "Photos",
          ].slice(0, 3 + Math.floor(Math.random() * 3)),
          requirements: ["Basic fitness level", "Swimming ability", "Age 12+", "Valid ID"].slice(
            0,
            2 + Math.floor(Math.random() * 2),
          ),
        })) || []

      setActivities(enhancedActivities)
    } catch (error) {
      console.error("Error loading activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = activities

    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedFilters.type !== "All types") {
      filtered = filtered.filter((activity) => activity.type === selectedFilters.type)
    }

    if (selectedFilters.island !== "All islands") {
      filtered = filtered.filter((activity) => activity.island_name === selectedFilters.island)
    }

    if (selectedFilters.difficulty !== "Any level") {
      filtered = filtered.filter((activity) => activity.difficulty_level === selectedFilters.difficulty)
    }

    if (selectedFilters.priceRange !== "Any price") {
      const [min, max] = selectedFilters.priceRange.split("-").map(Number)
      filtered = filtered.filter((activity) => activity.price >= min && activity.price <= max)
    }

    setFilteredActivities(filtered)
  }

  const handleBookActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setBookingDetails({
      ...bookingDetails,
      activityId: activity.id,
      totalPrice: activity.price,
    })
    setBookingStep("select")
    setBookingDialogOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setBookingDetails({ ...bookingDetails, date })
    }
  }

  const handleParticipantsChange = (participants: number) => {
    if (selectedActivity) {
      setBookingDetails({
        ...bookingDetails,
        participants,
        totalPrice: selectedActivity.price * participants,
      })
    }
  }

  const timeSlots = ["09:00", "11:00", "14:00", "16:00", "18:00"]
  const uniqueTypes = [...new Set(activities.map((a) => a.type))]
  const uniqueIslands = [...new Set(activities.map((a) => a.island_name))]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Challenging":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Loading amazing activities...</p>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Book Amazing Experiences</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover and book unforgettable activities, tours, and experiences across your selected island destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filter Activities
              </h3>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Activity Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Activity Type</Label>
                  <Select
                    value={selectedFilters.type}
                    onValueChange={(value) => setSelectedFilters({ ...selectedFilters, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All types">All types</SelectItem>
                      {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Island */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Island</Label>
                  <Select
                    value={selectedFilters.island}
                    onValueChange={(value) => setSelectedFilters({ ...selectedFilters, island: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All islands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All islands">All islands</SelectItem>
                      {uniqueIslands.map((island) => (
                        <SelectItem key={island} value={island}>
                          {island}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                  <Select
                    value={selectedFilters.priceRange}
                    onValueChange={(value) => setSelectedFilters({ ...selectedFilters, priceRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any price">Any price</SelectItem>
                      <SelectItem value="0-50">$0 - $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200-500">$200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                  <Select
                    value={selectedFilters.difficulty}
                    onValueChange={(value) => setSelectedFilters({ ...selectedFilters, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any level">Any level</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Activities Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="island-card overflow-hidden">
                  <div className="relative">
                    <img
                      src={activity.image_url || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getDifficultyColor(activity.difficulty_level)}>
                        {activity.difficulty_level}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-800">{activity.type}</Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-serif font-bold line-clamp-2">{activity.title}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{activity.rating?.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {activity.location}, {activity.island_name}
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">{activity.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {activity.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Max {activity.max_participants}
                          </span>
                        </div>
                        <span className="text-green-600 font-medium">{activity.available_spots} spots left</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-2xl font-bold text-emerald-600">${activity.price}</span>
                          <span className="text-sm text-muted-foreground ml-1">per person</span>
                        </div>
                        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={() => handleBookActivity(activity)} className="ocean-button">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Book Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Book {selectedActivity?.title}</DialogTitle>
                              <DialogDescription>Complete your booking in a few simple steps</DialogDescription>
                            </DialogHeader>

                            {bookingStep === "select" && selectedActivity && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Select Date</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="w-full justify-start text-left font-normal bg-transparent"
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {bookingDetails.date ? formatDate(bookingDetails.date) : "Pick a date"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0">
                                        <Calendar
                                          mode="single"
                                          selected={bookingDetails.date}
                                          onSelect={handleDateSelect}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Time Slot</Label>
                                    <Select
                                      value={bookingDetails.timeSlot}
                                      onValueChange={(value) =>
                                        setBookingDetails({ ...bookingDetails, timeSlot: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timeSlots.map((time) => (
                                          <SelectItem key={time} value={time}>
                                            {time}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Number of Participants</Label>
                                  <Select
                                    value={bookingDetails.participants.toString()}
                                    onValueChange={(value) => handleParticipantsChange(Number.parseInt(value))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from(
                                        { length: Math.min(selectedActivity.max_participants, 10) },
                                        (_, i) => i + 1,
                                      ).map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                          {num} {num === 1 ? "person" : "people"}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Total Price:</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                      ${bookingDetails.totalPrice}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    ${selectedActivity.price} × {bookingDetails.participants} participants
                                  </p>
                                </div>

                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => setBookingDialogOpen(false)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => setBookingStep("details")}
                                    className="flex-1 ocean-button"
                                    disabled={!bookingDetails.date || !bookingDetails.timeSlot}
                                  >
                                    Continue
                                  </Button>
                                </div>
                              </div>
                            )}

                            {bookingStep === "details" && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                      id="name"
                                      value={bookingDetails.customerInfo.name}
                                      onChange={(e) =>
                                        setBookingDetails({
                                          ...bookingDetails,
                                          customerInfo: { ...bookingDetails.customerInfo, name: e.target.value },
                                        })
                                      }
                                      placeholder="Enter your full name"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={bookingDetails.customerInfo.email}
                                      onChange={(e) =>
                                        setBookingDetails({
                                          ...bookingDetails,
                                          customerInfo: { ...bookingDetails.customerInfo, email: e.target.value },
                                        })
                                      }
                                      placeholder="Enter your email"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="phone">Phone Number</Label>
                                  <Input
                                    id="phone"
                                    value={bookingDetails.customerInfo.phone}
                                    onChange={(e) =>
                                      setBookingDetails({
                                        ...bookingDetails,
                                        customerInfo: { ...bookingDetails.customerInfo, phone: e.target.value },
                                      })
                                    }
                                    placeholder="Enter your phone number"
                                  />
                                </div>

                                <div className="flex gap-3">
                                  <Button variant="outline" onClick={() => setBookingStep("select")} className="flex-1">
                                    Back
                                  </Button>
                                  <Button
                                    onClick={() => setBookingStep("confirm")}
                                    className="flex-1 ocean-button"
                                    disabled={
                                      !bookingDetails.customerInfo.name ||
                                      !bookingDetails.customerInfo.email ||
                                      !bookingDetails.customerInfo.phone
                                    }
                                  >
                                    Review Booking
                                  </Button>
                                </div>
                              </div>
                            )}

                            {bookingStep === "confirm" && selectedActivity && (
                              <div className="space-y-6">
                                <div className="bg-card p-6 rounded-lg border">
                                  <h4 className="font-semibold mb-4">Booking Summary</h4>
                                  <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                      <span>Activity:</span>
                                      <span className="font-medium">{selectedActivity.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Date:</span>
                                      <span>{formatDate(bookingDetails.date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Time:</span>
                                      <span>{bookingDetails.timeSlot}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Participants:</span>
                                      <span>{bookingDetails.participants}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Customer:</span>
                                      <span>{bookingDetails.customerInfo.name}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-semibold">
                                      <span>Total:</span>
                                      <span className="text-emerald-600">${bookingDetails.totalPrice}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => setBookingStep("details")}
                                    className="flex-1"
                                  >
                                    Back
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      // Here you would process the booking
                                      alert("Booking confirmed! You will receive a confirmation email shortly.")
                                      setBookingDialogOpen(false)
                                      setBookingStep("select")
                                    }}
                                    className="flex-1 ocean-button"
                                  >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Confirm & Pay
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredActivities.length === 0 && !loading && (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No activities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
