import type { Metadata } from "next"
import { MapPin, Users, Award, Heart } from "lucide-react"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "About Us - Island Paradise Tourism",
  description:
    "Learn about our mission to showcase the world's most beautiful islands and create unforgettable travel experiences.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">About Island Paradise</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We're passionate about connecting travelers with the world's most breathtaking islands, creating
            unforgettable experiences through immersive virtual tours, comprehensive travel guides, and curated local
            experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Island Paradise Tourism was founded with a simple yet ambitious goal: to make the world's most stunning
                islands accessible to everyone. Through cutting-edge 3D virtual tours, interactive maps, and
                comprehensive travel resources, we bridge the gap between wanderlust and reality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're planning your next adventure or exploring from home, we provide the tools and inspiration
                to discover paradise, one island at a time.
              </p>
            </div>
            <div className="relative">
              <img src="/tropical-island-sunset.png" alt="Tropical island sunset" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Experiences</h3>
              <p className="text-gray-600">
                We showcase genuine local culture, hidden gems, and authentic island experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">Supporting local communities and promoting sustainable tourism practices.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Curating only the highest quality experiences and most reliable travel information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Passion</h3>
              <p className="text-gray-600">
                Every destination is chosen with love and deep appreciation for natural beauty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Founded by a team of passionate travelers and technology enthusiasts, Island Paradise Tourism combines years
            of exploration experience with cutting-edge web technology. Our founders have personally visited over 50
            islands worldwide, bringing firsthand knowledge to every destination we feature.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            From the crystal-clear waters of the Maldives to the volcanic landscapes of Santorini, we've walked these
            shores, tasted the local cuisine, and built relationships with island communities to bring you the most
            authentic travel experiences possible.
          </p>
        </div>
      </section>
    </div>
  )
}
