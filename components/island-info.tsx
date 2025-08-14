import type { Island } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Info, Shield } from "lucide-react"

interface IslandInfoProps {
  island: Island
}

export default function IslandInfo({ island }: IslandInfoProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Main Description */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About {island.name}</h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p>{island.description}</p>
            </div>

            {/* Languages */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Languages Spoken</h3>
              <div className="flex flex-wrap gap-3">
                {island.languages?.map((language, index) => (
                  <span key={index} className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full font-medium">
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Hotels */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Hotels</h3>
              <p className="text-gray-600 mb-4">
                Discover the best accommodations on {island.name}, from luxury resorts to boutique hotels.
              </p>
              <a
                href={`/hotels?island=${island.slug}`}
                className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                View Hotels
              </a>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            {/* Climate Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Thermometer className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Climate</h3>
                    <p className="text-gray-600">{island.climate_info}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cultural Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Info className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Culture & Heritage</h3>
                    <p className="text-gray-600">{island.cultural_info}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regulatory Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel Requirements</h3>
                    <p className="text-gray-600 mb-3">{island.regulatory_info}</p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Visa Requirements:</strong> {island.visa_requirements}
                      </p>
                    </div>
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
