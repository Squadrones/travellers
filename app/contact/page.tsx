import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Contact Us - Island Paradise Tourism",
  description: "Get in touch with our team for travel inquiries, partnerships, or support.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Have questions about your next island adventure? Need help planning the perfect getaway? Our travel experts
            are here to help make your island dreams come true.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input id="firstName" type="text" placeholder="John" className="w-full" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input id="lastName" type="text" placeholder="Doe" className="w-full" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input id="email" type="email" placeholder="john@example.com" className="w-full" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input id="subject" type="text" placeholder="Travel inquiry" className="w-full" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us about your dream island destination..."
                  className="w-full"
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">hello@islandparadise.com</p>
                    <p className="text-gray-600">support@islandparadise.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">123 Paradise Boulevard</p>
                    <p className="text-gray-600">Miami Beach, FL 33139</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Answers</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How do I book a hotel?</h3>
                  <p className="text-gray-600 text-sm">
                    Browse our hotel listings and click "Book Now" to be redirected to our trusted booking partners.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Are the virtual tours free?</h3>
                  <p className="text-gray-600 text-sm">
                    Yes! All our 3D virtual tours are completely free to explore and enjoy.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you offer travel planning services?</h3>
                  <p className="text-gray-600 text-sm">
                    We provide comprehensive travel guides and information. For personalized planning, contact our team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
