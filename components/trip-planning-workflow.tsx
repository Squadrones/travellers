"use client"

import { useState } from "react"
import { IslandSelectionSystem } from "@/components/island-selection-system"
import { EnhancedItineraryBuilder } from "@/components/enhanced-itinerary-builder"
import { ActivityBookingSystem } from "@/components/activity-booking-system"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { TripSharingSystem } from "@/components/trip-sharing-system"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Activity, Compass, Sparkles, Share2 } from "lucide-react"

interface Island {
  id: number
  name: string
  description: string
  image_url: string
  location: string
  country: string
  climate: string
  languages: string[]
  currency: string
  best_time_to_visit: string
  average_temperature: string
  population: number
  area_km2: number
  rating?: number
  price_range?: string
  activities?: string[]
  highlights?: string[]
}

export function TripPlanningWorkflow() {
  const [selectedIslands, setSelectedIslands] = useState<Island[]>([])
  const [currentStep, setCurrentStep] = useState("recommendations")

  const handleIslandSelect = (island: Island) => {
    setSelectedIslands([...selectedIslands, island])
  }

  const handleIslandDeselect = (islandId: number) => {
    setSelectedIslands(selectedIslands.filter((island) => island.id !== islandId))
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="islands" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Select Islands
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Book Activities
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Build Itinerary
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Trip
            </TabsTrigger>
            <TabsTrigger value="finalize" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Finalize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <PersonalizedRecommendations />
          </TabsContent>

          <TabsContent value="islands">
            <IslandSelectionSystem
              selectedIslands={selectedIslands}
              onIslandSelect={handleIslandSelect}
              onIslandDeselect={handleIslandDeselect}
            />
          </TabsContent>

          <TabsContent value="activities">
            <ActivityBookingSystem />
          </TabsContent>

          <TabsContent value="itinerary">
            <EnhancedItineraryBuilder />
          </TabsContent>

          <TabsContent value="share">
            <TripSharingSystem />
          </TabsContent>

          <TabsContent value="finalize">
            <div className="text-center py-20">
              <h3 className="text-2xl font-serif font-bold mb-4">Trip Finalization</h3>
              <p className="text-muted-foreground">Review your complete island adventure and proceed to booking</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
