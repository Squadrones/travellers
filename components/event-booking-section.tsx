"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, CreditCard } from "lucide-react"

interface EventBookingSectionProps {
  event: {
    id: number
    title: string
    price: number
    max_participants: number
    start_date: string
  }
}

export default function EventBookingSection({ event }: EventBookingSectionProps) {
  const [participants, setParticipants] = useState(1)
  const [isBooking, setIsBooking] = useState(false)

  const totalPrice = participants * event.price

  const handleBooking = async () => {
    setIsBooking(true)
    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsBooking(false)
    alert("Booking request submitted! We'll contact you shortly to confirm.")
  }

  return (
    <section className="py-16 bg-ocean-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-ocean-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Book This Event
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participants" className="text-ocean-800">
                    Number of Participants
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-ocean-500" />
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      max={event.max_participants}
                      value={participants}
                      onChange={(e) => setParticipants(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="border-ocean-200 focus:border-ocean-400"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-ocean-800">Total Price</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="w-4 h-4 text-ocean-500" />
                    <div className="text-2xl font-bold text-ocean-600">${totalPrice}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-ocean-800">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="border-ocean-200 focus:border-ocean-400"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-ocean-800">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-ocean-200 focus:border-ocean-400"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-ocean-800">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="border-ocean-200 focus:border-ocean-400"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-ocean-800">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or dietary requirements?"
                    className="border-ocean-200 focus:border-ocean-400"
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-ocean-50 p-4 rounded-lg">
                <h4 className="font-semibold text-ocean-800 mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-ocean-600">
                  <div className="flex justify-between">
                    <span>Event:</span>
                    <span>{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{participants}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-ocean-800 pt-2 border-t border-ocean-200">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-ocean-500 hover:bg-ocean-600 text-white py-3 text-lg"
              >
                {isBooking ? "Processing..." : "Book Now"}
              </Button>

              <p className="text-xs text-ocean-500 text-center">
                By booking, you agree to our terms and conditions. Full payment is required to secure your reservation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
