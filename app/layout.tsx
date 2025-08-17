import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

export const metadata: Metadata = {
  title: "Lombok Island - Discover Your Next Tropical Adventure",
  description: "Lombok Island is a beautiful island in Indonesia. It is known for its beautiful beaches, friendly people, pristine nature, and authentic culture. Plan your perfect tropical getaway with our comprehensive travel guide.",
  keywords: "Lombok Island, Indonesia, tropical paradise, beaches, travel guide, island vacation, Southeast Asia, adventure travel, cultural tourism",
  authors: [{ name: "Lombok Island Travel" }],
  creator: "Lombok Island Travel",
  publisher: "Lombok Island Travel",
  generator: "Next.js",
  applicationName: "Lombok Island Travel",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lomboksland.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lombok Island - Discover Your Next Tropical Adventure",
    description: "Explore the pristine beaches, vibrant culture, and natural wonders of Lombok Island. Your ultimate guide to paradise in Indonesia.",
    url: "https://lomboksland.com",
    siteName: "Lombok Island Travel",
    images: [
      {
        url: "/tropical-island-paradise.png",
        width: 1200,
        height: 630,
        alt: "Lombok Island Tropical Paradise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lombok Island - Discover Your Next Tropical Adventure",
    description: "Explore the pristine beaches, vibrant culture, and natural wonders of Lombok Island. Your ultimate guide to paradise in Indonesia.",
    images: ["/tropical-island-paradise.png"],
    creator: "@lomboktravel",
    site: "@lomboktravel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "travel",
  classification: "travel website",
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Lombok Island Travel",
    "mobile-web-app-capable": "yes",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfairDisplay.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
