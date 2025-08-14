import type { Island } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, CreditCard, Phone, AlertTriangle, Calendar, Thermometer } from "lucide-react"

interface TravelGuideProps {
  island: Island
}

export default function TravelGuide({ island }: TravelGuideProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Travel Guide</h2>
          <p className="text-xl text-gray-600">Everything you need to know for your trip to {island.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Visa & Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plane className="h-5 w-5 text-blue-600" />
                </div>
                Visa & Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{island.visa_requirements}</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Check your passport validity (6+ months recommended)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Currency & Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                Currency & Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">
                <strong>Currency:</strong> {island.currency}
              </p>
              <p className="text-gray-600 mb-4">
                Credit cards are widely accepted at hotels and restaurants. ATMs are available in main areas.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Tip:</strong> Carry some cash for local markets and small vendors
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Best Time to Visit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                Best Time to Visit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">
                <strong>Optimal Period:</strong> {island.best_time_to_visit}
              </p>
              <p className="text-gray-600 mb-4">{island.climate_info}</p>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Weather:</strong> Check seasonal patterns before booking
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                <strong>Languages:</strong> {island.languages?.join(", ")}
              </p>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Tip:</strong> Download a translation app for easier communication
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Health & Safety */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                Health & Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Travel insurance is recommended. Check with your healthcare provider about required vaccinations.
              </p>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Emergency:</strong> Keep important numbers and embassy contacts handy
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cultural Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Thermometer className="h-5 w-5 text-cyan-600" />
                </div>
                Cultural Etiquette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Respect local customs and traditions. Dress modestly when visiting religious sites.
              </p>
              <div className="bg-cyan-50 p-3 rounded-lg">
                <p className="text-sm text-cyan-800">
                  <strong>Respect:</strong> Learn basic greetings and cultural norms
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
