"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Star, MapPin, Compass, Sparkles, BookOpen, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserPreferences {
  travelStyle: string[]
  interests: string[]
  budgetRange: [number, number]
  groupSize: number
  duration: number
  activityLevel: string
  accommodationType: string[]
  diningPreferences: string[]
}

interface Recommendation {
  id: string
  type: "island" | "activity" | "hotel" | "restaurant"
  title: string
  description: string
  image_url: string
  location: string
  price: number
  rating: number
  matchScore: number
  reasons: string[]
  tags: string[]
  originalData: any
}

const defaultPreferences: UserPreferences = {
  travelStyle: [],
  interests: [],
  budgetRange: [1000, 5000],
  groupSize: 2,
  duration: 7,
  activityLevel: "moderate",
  accommodationType: [],
  diningPreferences: [],
}

export function PersonalizedRecommendations() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([])
  const [likedRecommendations, setLikedRecommendations] = useState<string[]>([])
  const [showPreferences, setShowPreferences] = useState(true)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const travelStyles = [
    "Adventure",
    "Relaxation",
    "Cultural",
    "Romantic",
    "Family-friendly",
    "Luxury",
    "Budget-conscious",
    "Solo travel",
  ]

  const interests = [
    "Beach activities",
    "Water sports",
    "Hiking",
    "Photography",
    "Local cuisine",
    "History",
    "Wildlife",
    "Nightlife",
    "Shopping",
    "Wellness",
    "Art & Culture",
    "Adventure sports",
  ]

  const accommodationTypes = ["Resort", "Boutique hotel", "Villa", "Hostel", "Apartment", "Eco-lodge"]

  const diningPreferences = ["Fine dining", "Local street food", "Vegetarian", "Seafood", "International cuisine"]

  useEffect(() => {
    if (!showPreferences) {
      generateRecommendations()
    }
  }, [preferences, showPreferences])

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      // Load data from Supabase
      const [islandsResult, eventsResult, hotelsResult] = await Promise.all([
        supabase.from("islands").select("*"),
        supabase.from("events").select("*"),
        supabase.from("hotels").select("*"),
      ])

      const islands = islandsResult.data || []
      const events = eventsResult.data || []
      const hotels = hotelsResult.data || []

      const allRecommendations: Recommendation[] = []

      // Generate island recommendations
      islands.forEach((island) => {
        const matchScore = calculateIslandMatchScore(island, preferences)
        if (matchScore > 0.3) {
          allRecommendations.push({
            id: `island-${island.id}`,
            type: "island",
            title: island.name,
            description: island.description,
            image_url: island.image_url,
            location: island.country,
            price: 0,
            rating: 4.2 + Math.random() * 0.6,
            matchScore,
            reasons: generateIslandReasons(island, preferences),
            tags: [island.climate, "Destination"],
            originalData: island,
          })
        }
      })

      // Generate activity recommendations
      events.forEach((event) => {
        const matchScore = calculateActivityMatchScore(event, preferences)
        if (matchScore > 0.3) {
          allRecommendations.push({
            id: `activity-${event.id}`,
            type: "activity",
            title: event.title,
            description: event.description,
            image_url: event.image_url,
            location: event.location,
            price: event.price || 0,
            rating: 4.0 + Math.random() * 0.8,
            matchScore,
            reasons: generateActivityReasons(event, preferences),
            tags: [event.type, "Activity"],
            originalData: event,
          })
        }
      })

      // Generate hotel recommendations
      hotels.forEach((hotel) => {
        const matchScore = calculateHotelMatchScore(hotel, preferences)
        if (matchScore > 0.3) {
          allRecommendations.push({
            id: `hotel-${hotel.id}`,
            type: "hotel",
            title: hotel.name,
            description: hotel.description,
            image_url: hotel.image_url,
            location: hotel.location,
            price: hotel.price_per_night || 200,
            rating: hotel.rating || 4.0,
            matchScore,
            reasons: generateHotelReasons(hotel, preferences),
            tags: ["Accommodation"],
            originalData: hotel,
          })
        }
      })

      // Sort by match score and filter out dismissed items
      const sortedRecommendations = allRecommendations
        .filter((rec) => !dismissedRecommendations.includes(rec.id))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 12)

      setRecommendations(sortedRecommendations)
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateIslandMatchScore = (island: any, prefs: UserPreferences): number => {
    let score = 0.5 // Base score

    // Climate preferences
    if (prefs.interests.includes("Beach activities") && island.climate === "Tropical") score += 0.3
    if (prefs.interests.includes("Hiking") && island.area_km2 > 100) score += 0.2
    if (prefs.travelStyle.includes("Adventure") && island.climate === "Tropical") score += 0.2
    if (prefs.travelStyle.includes("Relaxation") && island.climate === "Mediterranean") score += 0.2

    return Math.min(score, 1)
  }

  const calculateActivityMatchScore = (activity: any, prefs: UserPreferences): number => {
    let score = 0.4 // Base score

    // Interest matching
    if (prefs.interests.includes("Water sports") && activity.type === "Water Sports") score += 0.4
    if (prefs.interests.includes("Cultural") && activity.type === "Cultural") score += 0.4
    if (prefs.interests.includes("Adventure sports") && activity.type === "Adventure") score += 0.4

    // Budget matching
    const activityPrice = activity.price || 0
    if (activityPrice >= prefs.budgetRange[0] / 10 && activityPrice <= prefs.budgetRange[1] / 10) score += 0.2

    return Math.min(score, 1)
  }

  const calculateHotelMatchScore = (hotel: any, prefs: UserPreferences): number => {
    let score = 0.4 // Base score

    // Budget matching
    const hotelPrice = hotel.price_per_night || 200
    const dailyBudget = prefs.budgetRange[1] / prefs.duration
    if (hotelPrice <= dailyBudget * 0.4) score += 0.3 // Hotel should be ~40% of daily budget

    // Accommodation type matching
    if (prefs.accommodationType.includes("Resort") && hotel.type === "Resort") score += 0.2
    if (prefs.accommodationType.includes("Boutique hotel") && hotel.type === "Boutique") score += 0.2

    return Math.min(score, 1)
  }

  const generateIslandReasons = (island: any, prefs: UserPreferences): string[] => {
    const reasons = []
    if (prefs.interests.includes("Beach activities")) reasons.push("Perfect for beach lovers")
    if (prefs.travelStyle.includes("Adventure")) reasons.push("Great for adventure activities")
    if (island.climate === "Tropical") reasons.push("Beautiful tropical climate")
    if (prefs.travelStyle.includes("Cultural")) reasons.push("Rich cultural heritage")
    return reasons.slice(0, 3)
  }

  const generateActivityReasons = (activity: any, prefs: UserPreferences): string[] => {
    const reasons = []
    if (prefs.interests.includes("Water sports")) reasons.push("Matches your water sports interest")
    if (prefs.travelStyle.includes("Adventure")) reasons.push("Perfect for adventure seekers")
    if (activity.price <= prefs.budgetRange[1] / 10) reasons.push("Within your budget range")
    reasons.push("Highly rated by travelers")
    return reasons.slice(0, 3)
  }

  const generateHotelReasons = (hotel: any, prefs: UserPreferences): string[] => {
    const reasons = []
    if (hotel.rating >= 4.5) reasons.push("Excellent guest reviews")
    if (prefs.travelStyle.includes("Luxury")) reasons.push("Luxury amenities")
    if (prefs.travelStyle.includes("Romantic")) reasons.push("Perfect for couples")
    reasons.push("Great location")
    return reasons.slice(0, 3)
  }

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences({ ...preferences, [key]: value })
  }

  const handleArrayPreferenceChange = (key: keyof UserPreferences, value: string, checked: boolean) => {
    const currentArray = preferences[key] as string[]
    const newArray = checked ? [...currentArray, value] : currentArray.filter((item) => item !== value)
    setPreferences({ ...preferences, [key]: newArray })
  }

  const handleLikeRecommendation = (id: string) => {
    setLikedRecommendations([...likedRecommendations, id])
  }

  const handleDismissRecommendation = (id: string) => {
    setDismissedRecommendations([...dismissedRecommendations, id])
    setRecommendations(recommendations.filter((rec) => rec.id !== id))
  }

  const getRecommendationsByType = (type: string) => {
    return recommendations.filter((rec) => rec.type === type)
  }

  if (showPreferences) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Tell Us About Your Dream Trip</h2>
            <p className="text-xl text-muted-foreground">
              Share your preferences so we can create personalized recommendations just for you.
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-8">
              {/* Travel Style */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">What's your travel style?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {travelStyles.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={`style-${style}`}
                        checked={preferences.travelStyle.includes(style)}
                        onCheckedChange={(checked) =>
                          handleArrayPreferenceChange("travelStyle", style, checked as boolean)
                        }
                      />
                      <Label htmlFor={`style-${style}`} className="text-sm">
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">What interests you most?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={preferences.interests.includes(interest)}
                        onCheckedChange={(checked) =>
                          handleArrayPreferenceChange("interests", interest, checked as boolean)
                        }
                      />
                      <Label htmlFor={`interest-${interest}`} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">
                  Budget Range: ${preferences.budgetRange[0]} - ${preferences.budgetRange[1]}
                </Label>
                <Slider
                  value={preferences.budgetRange}
                  onValueChange={(value) => handlePreferenceChange("budgetRange", value)}
                  max={10000}
                  min={500}
                  step={250}
                  className="w-full"
                />
              </div>

              {/* Group Size and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-semibold mb-4 block">Group Size: {preferences.groupSize}</Label>
                  <Slider
                    value={[preferences.groupSize]}
                    onValueChange={(value) => handlePreferenceChange("groupSize", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold mb-4 block">Trip Duration: {preferences.duration} days</Label>
                  <Slider
                    value={[preferences.duration]}
                    onValueChange={(value) => handlePreferenceChange("duration", value[0])}
                    max={21}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  onClick={() => setShowPreferences(false)}
                  className="ocean-button text-lg px-12 py-4"
                  disabled={preferences.travelStyle.length === 0 || preferences.interests.length === 0}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get My Recommendations
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Your Personalized Recommendations</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Based on your preferences, we've curated the perfect experiences for your island adventure.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowPreferences(true)}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Compass className="w-4 h-4 mr-2" />
            Update Preferences
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Creating your personalized recommendations...</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All ({recommendations.length})</TabsTrigger>
              <TabsTrigger value="island">Islands ({getRecommendationsByType("island").length})</TabsTrigger>
              <TabsTrigger value="activity">Activities ({getRecommendationsByType("activity").length})</TabsTrigger>
              <TabsTrigger value="hotel">Hotels ({getRecommendationsByType("hotel").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onLike={() => handleLikeRecommendation(recommendation.id)}
                    onDismiss={() => handleDismissRecommendation(recommendation.id)}
                    isLiked={likedRecommendations.includes(recommendation.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="island">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRecommendationsByType("island").map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onLike={() => handleLikeRecommendation(recommendation.id)}
                    onDismiss={() => handleDismissRecommendation(recommendation.id)}
                    isLiked={likedRecommendations.includes(recommendation.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRecommendationsByType("activity").map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onLike={() => handleLikeRecommendation(recommendation.id)}
                    onDismiss={() => handleDismissRecommendation(recommendation.id)}
                    isLiked={likedRecommendations.includes(recommendation.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hotel">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRecommendationsByType("hotel").map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onLike={() => handleLikeRecommendation(recommendation.id)}
                    onDismiss={() => handleDismissRecommendation(recommendation.id)}
                    isLiked={likedRecommendations.includes(recommendation.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  )
}

interface RecommendationCardProps {
  recommendation: Recommendation
  onLike: () => void
  onDismiss: () => void
  isLiked: boolean
}

function RecommendationCard({ recommendation, onLike, onDismiss, isLiked }: RecommendationCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "island":
        return "bg-emerald-100 text-emerald-800"
      case "activity":
        return "bg-blue-100 text-blue-800"
      case "hotel":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="island-card overflow-hidden">
      <div className="relative">
        <img
          src={recommendation.image_url || "/placeholder.svg"}
          alt={recommendation.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getTypeColor(recommendation.type)}>{recommendation.type}</Badge>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="ghost" onClick={onDismiss} className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onLike}
            className={`w-8 h-8 p-0 ${isLiked ? "bg-red-100 text-red-600" : "bg-white/80 hover:bg-white"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 px-2 py-1 rounded-full text-sm font-medium">
            {Math.round(recommendation.matchScore * 100)}% match
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-serif font-bold line-clamp-2">{recommendation.title}</h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{recommendation.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          {recommendation.location}
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">{recommendation.description}</p>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {recommendation.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-purple-600" />
              Why we recommend this:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {recommendation.reasons.map((reason, index) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            {recommendation.price > 0 && (
              <div>
                <span className="text-lg font-bold text-purple-600">${recommendation.price}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  {recommendation.type === "hotel" ? "per night" : "per person"}
                </span>
              </div>
            )}
            <Button size="sm" className="ocean-button">
              <BookOpen className="w-4 h-4 mr-2" />
              {recommendation.type === "island" ? "Explore" : "Book Now"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
