import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">🏝️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Island Not Found</h1>
          <p className="text-xl text-gray-600">
            The island you're looking for seems to have drifted away. Let's get you back to paradise.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Islands
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
