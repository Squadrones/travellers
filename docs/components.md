# 🧩 Component Library

This document provides comprehensive documentation for all UI components used in the Island Paradise project.

## 📚 Overview

The project uses a combination of:
- **shadcn/ui** - Base component library
- **Custom Components** - Feature-specific components
- **Enhanced Components** - Advanced functionality components

## 🎨 Base UI Components (shadcn/ui)

### **Button Component**
```tsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

### **Card Component**
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### **Input Component**
```tsx
import { Input } from "@/components/ui/input"

<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
```

### **Dialog Component**
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

## 🏝️ Feature Components

### **Enhanced Hero Component**
**File**: `components/enhanced-hero.tsx`

A full-screen hero section with parallax background and animated content.

```tsx
import EnhancedHero from "@/components/enhanced-hero"

<EnhancedHero />
```

**Features**:
- Parallax background scrolling
- Animated text reveals
- Call-to-action buttons
- Statistics display
- Scroll indicator

**Props**: None (self-contained component)

### **Featured Islands Component**
**File**: `components/featured-islands.tsx`

Displays a grid of featured island destinations.

```tsx
import FeaturedIslands from "@/components/featured-islands"

<FeaturedIslands />
```

**Features**:
- Responsive grid layout
- Island cards with images
- Hover effects
- Loading states

### **Enhanced Virtual Tours Component**
**File**: `components/enhanced-virtual-tours.tsx`

Interactive virtual tour gallery with modal viewing.

```tsx
import EnhancedVirtualTours from "@/components/enhanced-virtual-tours"

<EnhancedVirtualTours />
```

**Features**:
- Tour grid layout
- Interactive tour selection
- Modal tour viewer
- Tour metadata display

### **Virtual Tour Modal Component**
**File**: `components/enhanced-virtual-tour-modal.tsx`

Modal component for viewing virtual tours in full screen.

```tsx
import EnhancedVirtualTourModal from "@/components/enhanced-virtual-tour-modal"

<EnhancedVirtualTourModal 
  tour={selectedTour}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

**Props**:
- `tour`: VirtualTour object
- `isOpen`: boolean for modal state
- `onClose`: function to close modal

## 🗺️ Interactive Components

### **World Map Component**
**File**: `components/world-map.tsx`

Interactive world map showing island locations.

```tsx
import WorldMap from "@/components/world-map"

<WorldMap />
```

**Features**:
- SVG-based world map
- Interactive island markers
- Hover tooltips
- Click navigation

### **Interactive Map Component**
**File**: `components/interactive-map.tsx`

Generic interactive map component for various use cases.

```tsx
import InteractiveMap from "@/components/interactive-map"

<InteractiveMap 
  locations={locations}
  onLocationClick={handleLocationClick}
/>
```

**Props**:
- `locations`: Array of location objects
- `onLocationClick`: Click handler function

## 📅 Planning Components

### **Enhanced Itinerary Builder Component**
**File**: `components/enhanced-itinerary-builder.tsx`

Advanced trip planning interface with drag-and-drop functionality.

```tsx
import { EnhancedItineraryBuilder } from "@/components/enhanced-itinerary-builder"

<EnhancedItineraryBuilder />
```

**Features**:
- Multi-day trip planning
- Activity integration
- Budget management
- Export functionality
- Search and filtering

### **Trip Planning Hero Component**
**File**: `components/trip-planning-hero.tsx`

Hero section for the trip planning page.

```tsx
import TripPlanningHero from "@/components/trip-planning-hero"

<TripPlanningHero />
```

### **Trip Planning Steps Component**
**File**: `components/trip-planning-steps.tsx`

Step-by-step guide for trip planning process.

```tsx
import TripPlanningSteps from "@/components/trip-planning-steps"

<TripPlanningSteps />
```

## 🏨 Accommodation Components

### **Hotel Card Component**
**File**: `components/hotel-card.tsx`

Individual hotel display card.

```tsx
import HotelCard from "@/components/hotel-card"

<HotelCard 
  hotel={hotelData}
  onBookNow={handleBooking}
/>
```

**Props**:
- `hotel`: Hotel object with details
- `onBookNow`: Booking handler function

### **Hotels Listing Component**
**File**: `components/hotels-listing.tsx`

Grid display of multiple hotels.

```tsx
import HotelsListing from "@/components/hotels-listing"

<HotelsListing 
  hotels={hotelsList}
  filters={activeFilters}
/>
```

**Props**:
- `hotels`: Array of hotel objects
- `filters`: Active filter state

### **Hotel Filters Component**
**File**: `components/hotel-filters.tsx`

Filtering interface for hotel search.

```tsx
import HotelFilters from "@/components/hotel-filters"

<HotelFilters 
  onFiltersChange={handleFilterChange}
  currentFilters={activeFilters}
/>
```

**Props**:
- `onFiltersChange`: Filter change handler
- `currentFilters`: Current filter state

## 🎉 Event Components

### **Event Card Component**
**File**: `components/event-card.tsx`

Individual event display card.

```tsx
import EventCard from "@/components/event-card"

<EventCard 
  event={eventData}
  onBookEvent={handleEventBooking}
/>
```

**Props**:
- `event`: Event object with details
- `onBookEvent`: Event booking handler

### **Events Listing Component**
**File**: `components/events-listing.tsx`

Grid display of multiple events.

```tsx
import EventsListing from "@/components/events-listing"

<EventsListing 
  events={eventsList}
  filters={activeFilters}
/>
```

**Props**:
- `events`: Array of event objects
- `filters`: Active filter state

### **Events Calendar Component**
**File**: `components/events-calendar.tsx`

Calendar view of events.

```tsx
import EventsCalendar from "@/components/events-calendar"

<EventsCalendar 
  events={eventsList}
  onDateSelect={handleDateSelect}
/>
```

**Props**:
- `events`: Array of event objects
- `onDateSelect`: Date selection handler

## 🎯 Advanced Components

### **Activity Booking System Component**
**File**: `components/activity-booking-system.tsx`

Comprehensive activity booking interface.

```tsx
import { ActivityBookingSystem } from "@/components/activity-booking-system"

<ActivityBookingSystem />
```

**Features**:
- Activity search and filtering
- Date and time selection
- Participant management
- Booking confirmation
- Payment integration

### **Personalized Recommendations Component**
**File**: `components/personalized-recommendations.tsx`

AI-powered recommendation system.

```tsx
import PersonalizedRecommendations from "@/components/personalized-recommendations"

<PersonalizedRecommendations 
  userPreferences={preferences}
  onRecommendationClick={handleRecommendation}
/>
```

**Props**:
- `userPreferences`: User preference object
- `onRecommendationClick`: Recommendation click handler

### **Trip Sharing System Component**
**File**: `components/trip-sharing-system.tsx`

Social sharing functionality for trips.

```tsx
import TripSharingSystem from "@/components/trip-sharing-system"

<TripSharingSystem 
  trip={tripData}
  onShare={handleShare}
/>
```

**Props**:
- `trip`: Trip object to share
- `onShare`: Share action handler

## 🔧 Utility Components

### **Navigation Component**
**File**: `components/navigation.tsx`

Main navigation bar.

```tsx
import Navigation from "@/components/navigation"

<Navigation />
```

**Features**:
- Responsive navigation
- Mobile menu
- Active page highlighting
- User account integration

### **Theme Provider Component**
**File**: `components/theme-provider.tsx`

Theme management and switching.

```tsx
import { ThemeProvider } from "@/components/theme-provider"

<ThemeProvider>
  <App />
</ThemeProvider>
```

**Features**:
- Light/dark theme switching
- Theme persistence
- System theme detection

## 📱 Responsive Design

All components are built with responsive design in mind:

- **Mobile First**: Components designed for mobile devices first
- **Breakpoints**: Uses Tailwind CSS breakpoints (sm, md, lg, xl)
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen size
- **Touch Friendly**: Interactive elements sized for touch devices

## 🎨 Styling Guidelines

### **Color Scheme**
- **Primary**: Amber/Yellow tones for tropical feel
- **Secondary**: Blue tones for water/ocean themes
- **Accent**: Green tones for nature/vegetation
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headings**: Playfair Display (serif) for elegance
- **Body**: DM Sans (sans-serif) for readability
- **Hierarchy**: Clear size progression (h1 → h6)

### **Spacing**
- **Consistent**: Uses Tailwind CSS spacing scale
- **Responsive**: Adapts spacing based on screen size
- **Component**: Internal spacing follows design system

## 🔄 Component Updates

When updating components:

1. **Maintain Props Interface**: Don't break existing prop contracts
2. **Update Documentation**: Keep this document current
3. **Test Responsiveness**: Ensure mobile compatibility
4. **Follow Patterns**: Maintain consistency with existing components

## 📚 Additional Resources

- **[shadcn/ui Documentation](https://ui.shadcn.com/)** - Base component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Component Examples](./examples.md)** - Usage examples and patterns

---

*For specific component questions, check the component source code or open an issue in the repository.*
