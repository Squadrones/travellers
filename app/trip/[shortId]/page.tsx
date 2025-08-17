"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { SharedTripViewer } from "@/components/shared-trip-viewer"

export default function SharedTripPage() {
  const params = useParams()
  const shortId = params.shortId as string

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SharedTripViewer shortId={shortId} />
    </div>
  )
}


