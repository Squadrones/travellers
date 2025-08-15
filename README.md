# Island Paradise - Tropical Travel Platform

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#️-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#️-project-structure)
- [Technology Stack](#-technology-stack)
- [Available Scripts](#-available-scripts)
- [Development](#-development)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Support](#-support)
- [Roadmap](#-roadmap)

---

## 🌴 Overview

Island Paradise is a modern, interactive travel platform that allows users to explore tropical destinations through virtual tours, plan customized itineraries, and discover unique island experiences. Built with Next.js 15, TypeScript, and Tailwind CSS, it provides an immersive way to explore the world's most beautiful islands before planning your next adventure.

## ✨ Features

### 🏝️ **Island Exploration**
- **Interactive Island Discovery**: Browse through curated tropical destinations with detailed information
- **Virtual Island Tours**: Immersive 360° panoramic experiences of island locations
- **Island Gallery**: High-quality images and descriptions of each destination
- **Interactive Maps**: Visual representation of island locations and attractions

### 🗺️ **Virtual Tours & Experiences**
- **360° Panoramic Views**: Immersive virtual tours of beaches, lagoons, and mountain peaks
- **Tour Categories**: Beach experiences, lagoon tours, mountain vistas, and more
- **Duration & Rating System**: Detailed tour information with user ratings
- **Interactive Tour Modal**: Enhanced viewing experience with tour details

### 📅 **Trip Planning & Itinerary Builder**
- **Smart Itinerary Builder**: Drag-and-drop interface for creating custom travel plans
- **Multi-Day Planning**: Organize activities across multiple days
- **Activity Integration**: Seamlessly add islands, events, hotels, and activities
- **Budget Management**: Track expenses and set budget constraints
- **Export Options**: Download and share your travel plans

### 🏨 **Hotel & Accommodation**
- **Comprehensive Hotel Listings**: Detailed information about accommodations
- **Filtering System**: Search by location, rating, price range, and amenities
- **Hotel Cards**: Rich information display with images and details
- **Booking Integration**: Direct links to hotel booking platforms

### 🎉 **Events & Activities**
- **Event Discovery**: Find local events, festivals, and cultural activities
- **Activity Booking System**: Reserve spots for island adventures
- **Event Calendar**: Browse events by date and location
- **Activity Categories**: Filter by type, difficulty, and price range

### 🎯 **Advanced Features**
- **Personalized Recommendations**: AI-powered suggestions based on preferences
- **Interactive World Map**: Global view of all destinations
- **Search & Filtering**: Advanced search capabilities across all content
- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Theme**: Customizable user interface

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

### **Required Software**
- **Node.js** (v18.17 or higher)
- **pnpm** (v8.0 or higher) - Package manager
- **Git** (for version control)

### **Database Requirements**
- **Supabase Account** - For backend database and authentication
- **PostgreSQL** (if running locally)

### **Environment Setup**
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Code Editor** (VS Code recommended with TypeScript extensions)

## 🚀 Installation & Setup

### 1. **Clone the Repository**
```bash
git clone <your-repository-url>
cd travellers
```

### 2. **Install Dependencies**
```bash
pnpm install
```

### 3. **Environment Configuration**
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Additional environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. **Database Setup**
Run the SQL scripts in the `scripts/` directory to set up your database:

```bash
# Execute in your Supabase SQL editor or local PostgreSQL
# 1. Create tables
psql -f scripts/01-create-tables.sql

# 2. Seed initial data
psql -f scripts/02-seed-islands.sql
psql -f scripts/03-seed-destinations.sql
psql -f scripts/04-seed-events.sql
psql -f scripts/05-seed-hotels.sql
```

### 5. **Start Development Server**
```bash
pnpm dev
```

Your application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
travellers/
├── app/                    # Next.js 15 app directory
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── events/            # Events listing and detail pages
│   ├── hotels/            # Hotel listings and detail pages
│   ├── islands/           # Island exploration pages
│   ├── plan-trip/         # Trip planning interface
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── enhanced-*.tsx    # Enhanced feature components
│   └── *.tsx             # Feature-specific components
├── lib/                  # Utility libraries
│   ├── supabase/         # Database client and types
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── scripts/              # Database setup scripts
└── styles/               # Additional styling
```

## 🎨 Technology Stack

### **Frontend**
- **Next.js 15** - React framework with app router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### **UI Components**
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **REST API** - Custom API endpoints

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Fast package manager

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:setup     # Run database setup scripts
pnpm db:seed      # Seed database with sample data
```

## 🚀 Development

### **Local Development**
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### **Environment Variables**
Ensure your `.env.local` file contains all necessary environment variables for local development.

## 📚 Documentation

This project includes comprehensive documentation in the `/docs` directory:

- **[API Reference](./docs/api.md)** - Backend API endpoints and usage
- **[Component Library](./docs/components.md)** - UI component documentation
- **[Database Schema](./docs/database.md)** - Database structure and relationships
- **[Deployment Guide](./docs/deployment.md)** - Deployment instructions
- **[Contributing Guidelines](./docs/contributing.md)** - How to contribute to the project
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions

For detailed setup and development information, refer to the specific documentation files.

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📚 Documentation

This project includes comprehensive documentation in the `/docs` directory:

- **[📖 Documentation Index](./docs/README.md)** - Overview of all available documentation
- **[🚀 Installation Guide](./docs/installation.md)** - Step-by-step setup instructions
- **[🧩 Component Library](./docs/components.md)** - UI component documentation
- **[🗄️ Database Schema](./docs/database.md)** - Database structure and relationships
- **[🗺️ Virtual Tours](./docs/features/virtual-tours.md)** - Virtual tour system documentation

For detailed setup and development information, refer to the specific documentation files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and component structure
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Community**: Join our community discussions

## 🎯 Roadmap

- [ ] **Mobile App**: React Native companion app
- [ ] **AI Travel Assistant**: ChatGPT integration for trip planning
- [ ] **Social Features**: Share trips and connect with other travelers
- [ ] **Offline Support**: PWA capabilities for offline browsing
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Analytics**: User behavior and preference tracking

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

*Discover your next paradise destination today!* 🌴✨