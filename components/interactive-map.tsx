"use client"

import { useEffect, useRef } from "react"
import type { Island, Destination } from "@/lib/types"

// Leaflet types and imports
declare global {
  interface Window {
    L: any
  }
}

interface InteractiveMapProps {
  islands?: Island[]
  destinations?: Destination[]
  center?: [number, number]
  zoom?: number
  height?: string
  showIslandMarkers?: boolean
  showDestinationMarkers?: boolean
}

export default function InteractiveMap({
  islands = [],
  destinations = [],
  center = [20.0, 0.0],
  zoom = 2,
  height = "400px",
  showIslandMarkers = true,
  showDestinationMarkers = true,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Load Leaflet JS
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = initializeMap
        document.head.appendChild(script)
      } else if (window.L) {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      const L = window.L

      // Initialize map
      const map = L.map(mapRef.current).setView(center, zoom)

      // Add tile layer with custom styling
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Custom island icon
      const islandIcon = L.divIcon({
        html: `
          <div class="custom-marker island-marker">
            <div class="marker-inner">🏝️</div>
          </div>
        `,
        className: "custom-div-icon",
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      })

      // Custom destination icons
      const getDestinationIcon = (type: string) => {
        const iconMap: { [key: string]: string } = {
          beach: "🏖️",
          landmark: "🏛️",
          restaurant: "🍽️",
          hotel: "🏨",
          activity: "🎯",
        }

        return L.divIcon({
          html: `
            <div class="custom-marker destination-marker">
              <div class="marker-inner">${iconMap[type.toLowerCase()] || "📍"}</div>
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })
      }

      // Add island markers
      if (showIslandMarkers && islands.length > 0) {
        islands.forEach((island) => {
          if (island.coordinates) {
            const marker = L.marker([island.coordinates.lat, island.coordinates.lng], {
              icon: islandIcon,
            }).addTo(map)

            const popupContent = `
              <div class="enhanced-map-popup">
                <div class="popup-image-container">
                  <img src="${
                    island.main_image_url ||
                    `/placeholder.svg?height=200&width=300&query=${island.name} island aerial view`
                  }" alt="${island.name}" class="popup-image" />
                  <div class="popup-overlay">
                    <span class="popup-category">Island</span>
                  </div>
                </div>
                <div class="popup-content">
                  <h3 class="popup-title">${island.name}</h3>
                  <p class="popup-location">📍 ${island.location}</p>
                  <p class="popup-description">${island.short_description}</p>
                  <div class="popup-actions">
                    <a href="/islands/${island.slug}" class="popup-button primary">Explore Island</a>
                    <button class="popup-button secondary" onclick="window.open('/islands/${island.slug}#virtual-tour', '_blank')">Virtual Tour</button>
                  </div>
                </div>
              </div>
            `

            marker.bindPopup(popupContent, {
              maxWidth: 320,
              className: "custom-popup",
            })
          }
        })

        // Fit map to show all islands
        if (islands.length > 1) {
          const group = new L.featureGroup(
            islands
              .filter((island) => island.coordinates)
              .map((island) => L.marker([island.coordinates.lat, island.coordinates.lng])),
          )
          map.fitBounds(group.getBounds().pad(0.1))
        }
      }

      // Add destination markers
      if (showDestinationMarkers && destinations.length > 0) {
        destinations.forEach((destination) => {
          if (destination.coordinates) {
            const marker = L.marker([destination.coordinates.lat, destination.coordinates.lng], {
              icon: getDestinationIcon(destination.type),
            }).addTo(map)

            const popupContent = `
              <div class="enhanced-map-popup">
                <div class="popup-image-container">
                  <img src="${
                    destination.image_url ||
                    `/placeholder.svg?height=200&width=300&query=${destination.name} ${destination.type}`
                  }" alt="${destination.name}" class="popup-image" />
                  <div class="popup-overlay">
                    <span class="popup-category">${destination.type}</span>
                    ${destination.rating ? `<span class="popup-rating">⭐ ${destination.rating}</span>` : ""}
                  </div>
                </div>
                <div class="popup-content">
                  <h3 class="popup-title">${destination.name}</h3>
                  <p class="popup-description">${destination.description}</p>
                  <div class="popup-actions">
                    ${
                      destination.website_url
                        ? `<a href="${destination.website_url}" target="_blank" class="popup-button primary">Visit Website</a>`
                        : `<button class="popup-button primary">Learn More</button>`
                    }
                    <button class="popup-button secondary" onclick="window.open('#virtual-tour-${destination.id}', '_blank')">360° View</button>
                  </div>
                </div>
              </div>
            `

            marker.bindPopup(popupContent, {
              maxWidth: 320,
              className: "custom-popup",
            })
          }
        })

        // Fit map to show all destinations
        if (destinations.length > 1) {
          const group = new L.featureGroup(
            destinations
              .filter((dest) => dest.coordinates)
              .map((dest) => L.marker([dest.coordinates.lat, dest.coordinates.lng])),
          )
          map.fitBounds(group.getBounds().pad(0.1))
        }
      }

      mapInstanceRef.current = map
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [islands, destinations, center, zoom, showIslandMarkers, showDestinationMarkers])

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg overflow-hidden shadow-lg" />

      {/* Enhanced CSS for beautiful map popups */}
      <style jsx global>{`
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }

        .custom-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .custom-marker:hover {
          transform: scale(1.15) translateY(-2px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
        }

        .island-marker {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          width: 44px;
          height: 44px;
          border: 3px solid rgba(255, 255, 255, 0.9);
        }

        .destination-marker {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          width: 36px;
          height: 36px;
          border: 2px solid rgba(255, 255, 255, 0.9);
        }

        .marker-inner {
          font-size: 18px;
          line-height: 1;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
          width: 320px !important;
        }

        .enhanced-map-popup {
          position: relative;
          min-width: 300px;
        }

        .popup-image-container {
          position: relative;
          overflow: hidden;
        }

        .popup-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .popup-image:hover {
          transform: scale(1.05);
        }

        .popup-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.7) 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px;
        }

        .popup-category {
          background: rgba(139, 92, 246, 0.9);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
        }

        .popup-rating {
          background: rgba(245, 158, 11, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .popup-content {
          padding: 20px;
        }

        .popup-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #1f2937;
          line-height: 1.3;
        }

        .popup-location {
          font-size: 13px;
          color: #0891b2;
          margin: 0 0 12px 0;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .popup-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .popup-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .popup-button {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          text-align: center;
          min-width: 100px;
        }

        .popup-button.primary {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }

        .popup-button.primary:hover {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .popup-button.secondary {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .popup-button.secondary:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: #8b5cf6;
          transform: translateY(-1px);
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .leaflet-popup-close-button {
          color: #6b7280 !important;
          font-size: 18px !important;
          padding: 8px !important;
          width: auto !important;
          height: auto !important;
          transition: all 0.2s ease !important;
        }

        .leaflet-popup-close-button:hover {
          color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.1) !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  )
}
