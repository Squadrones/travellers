# 🚀 Installation Guide

This guide will walk you through setting up the Island Paradise project on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### **Required Software**
- **Node.js** (v18.17 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify with: `node --version`
- **pnpm** (v8.0 or higher)
  - Install with: `npm install -g pnpm`
  - Verify with: `pnpm --version`
- **Git** (for version control)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify with: `git --version`

### **Database Requirements**
- **Supabase Account** - [Create one here](https://supabase.com/)
- **PostgreSQL Knowledge** (basic understanding recommended)

### **Development Environment**
- **Code Editor** - VS Code recommended with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

## 🔧 Step-by-Step Installation

### 1. **Clone the Repository**
```bash
# Clone the repository
git clone <your-repository-url>
cd travellers

# Verify the structure
ls -la
```

### 2. **Install Dependencies**
```bash
# Install all dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```

### 3. **Environment Configuration**
Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add the following content to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Island Paradise"

# Optional: Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

### 4. **Supabase Setup**

#### **Create a New Project**
1. Go to [supabase.com](https://supabase.com/)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `island-paradise-dev`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to you
6. Click "Create new project"

#### **Get Project Credentials**
1. In your project dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key
3. Update your `.env.local` file with these values

### 5. **Database Setup**

#### **Run Database Scripts**
Execute the SQL scripts in the `scripts/` directory:

```bash
# Option 1: Using Supabase Dashboard
# Go to SQL Editor in your Supabase dashboard and run each script

# Option 2: Using psql (if you have PostgreSQL CLI)
psql -h your-supabase-host -U postgres -d postgres -f scripts/01-create-tables.sql
psql -h your-supabase-host -U postgres -d postgres -f scripts/02-seed-islands.sql
psql -h your-supabase-host -U postgres -d postgres -f scripts/03-seed-destinations.sql
psql -h your-supabase-host -U postgres -d postgres -f scripts/04-seed-events.sql
psql -h your-supabase-host -U postgres -d postgres -f scripts/05-seed-hotels.sql
```

#### **Verify Database Setup**
Check that your tables were created:
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 6. **Start Development Server**
```bash
# Start the development server
pnpm dev
```

Your application should now be running at `http://localhost:3000`

## ✅ Verification

### **Check Application**
1. Open `http://localhost:3000` in your browser
2. You should see the Island Paradise homepage
3. Navigate through different sections to ensure they load

### **Check Database Connection**
1. Open browser developer tools (F12)
2. Check the console for any database connection errors
3. Verify that data is loading in components

### **Check Build Process**
```bash
# Test production build
pnpm build

# If successful, start production server
pnpm start
```

## 🐛 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev --port 3001
```

#### **Environment Variables Not Loading**
```bash
# Restart the development server
pnpm dev

# Check if .env.local is in the root directory
ls -la .env.local
```

#### **Database Connection Errors**
- Verify your Supabase credentials in `.env.local`
- Check if your Supabase project is active
- Ensure database scripts have been executed

#### **Dependency Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🔄 Next Steps

After successful installation:

1. **Explore the Codebase**: Read through the [project structure](./project-structure.md)
2. **Understand Components**: Review the [component library](./components.md)
3. **Learn the API**: Check the [API reference](./api.md)
4. **Start Developing**: Follow the [development workflow](./development-workflow.md)

## 📚 Additional Resources

- **[Quick Start Guide](./quick-start.md)** - Get up and running in 5 minutes
- **[Database Schema](./database.md)** - Understanding the data structure
- **[Component Library](./components.md)** - UI component documentation
- **[Troubleshooting](./troubleshooting.md)** - Common problems and solutions

---

*Need help? Check the [troubleshooting guide](./troubleshooting.md) or open an issue in the repository.*
