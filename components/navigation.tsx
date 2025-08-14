"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Waves } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-cyan-600">
            <Waves className="h-6 w-6" />
            Island Paradise
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/islands" className="text-gray-600 hover:text-cyan-600 transition-colors">
              Islands
            </Link>
            <Link href="/hotels" className="text-gray-600 hover:text-cyan-600 transition-colors">
              Hotels
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-cyan-600 transition-colors">
              Experiences
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-cyan-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-cyan-600 transition-colors">
              Contact
            </Link>
            <Link href="/plan-trip">
              <Button className="bg-violet-500 hover:bg-violet-600 text-white">Plan Your Trip</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-cyan-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/islands" className="text-gray-600 hover:text-cyan-600 transition-colors">
                Islands
              </Link>
              <Link href="/hotels" className="text-gray-600 hover:text-cyan-600 transition-colors">
                Hotels
              </Link>
              <Link href="/events" className="text-gray-600 hover:text-cyan-600 transition-colors">
                Experiences
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-cyan-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-cyan-600 transition-colors">
                Contact
              </Link>
              <Link href="/plan-trip">
                <Button className="bg-violet-500 hover:bg-violet-600 text-white w-fit">Plan Your Trip</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
