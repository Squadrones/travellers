import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pdf } from '@react-pdf/renderer'
import { TripPDFDocument } from '@/components/trip-pdf-document'

// Utility function for combining CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// PDF Generation utilities
export function generatePDFContent(tripData: any, itineraryItems: any[]) {
  return TripPDFDocument({ tripData, itineraryItems })
}

export async function downloadPDF(document: any, filename: string) {
  try {
    const blob = await pdf(document).toBlob()
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.pdf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  }
}

// URL shortening utilities
export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function createShareableUrl(shortId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/trip/${shortId}`
  }
  return `/trip/${shortId}`
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      textArea.remove()
      return Promise.resolve()
    } catch (err) {
      textArea.remove()
      return Promise.reject(err)
    }
  }
}
