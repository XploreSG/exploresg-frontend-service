[![CI Frontend - Build, Test & Security Scan](https://github.com/XploreSG/exploresg-frontend-service/actions/workflows/ci.yml/badge.svg)](https://github.com/XploreSG/exploresg-frontend-service/actions/workflows/ci.yml)

# 🚗 ExploreSG - Discover Singapore

A modern, full-stack React TypeScript application for exploring Singapore's attractions, weather, and car rental services. Built with cutting-edge web technologies featuring Google OAuth authentication, role-based access control (RBAC), dynamic fleet management, real-time weather integration, and interactive mapping with Mapbox GL.

## 🌟 Overview

ExploreSG is a comprehensive web platform designed to help tourists and locals discover Singapore's offerings. The application includes a sophisticated car rental system with fleet management dashboards, Google OAuth authentication, role-based permissions, real-time weather data, interactive maps, and a complete booking flow—all optimized for responsive design across all devices.

## ✨ Key Features

### � Authentication & Authorization

- **Google OAuth Integration**: Secure sign-in with Google accounts using @react-oauth/google
- **JWT Authentication**: Token-based authentication with Bearer tokens
- **Role-Based Access Control (RBAC)**: Five-tier permission system (USER, FLEET_MANAGER, MANAGER, SUPPORT, ADMIN)
- **Protected Routes**: Role-based route protection and access control
- **Secure Sign-Up Flow**: New user registration with role restrictions (USER only for new accounts)
- **Session Management**: Persistent authentication with localStorage and token refresh

### 🚘 Car Rental System

- **User Vehicle Browsing**: Customer-facing vehicle catalog with advanced filtering
- **Multi-Step Booking Process**: Streamlined booking flow with progress tracking
- **Real-Time Pricing**: Dynamic pricing calculation with add-ons and insurance options
- **Advanced Filtering**: Filter by price, vehicle type, seats, transmission, and more
- **Responsive Car Cards**: Interactive car cards with hover effects and animations
- **State Management**: Seamless data flow between booking steps using React Router state

### 🚗 Fleet Management System (FLEET_MANAGER & ADMIN)

- **Fleet Dashboard**: Comprehensive analytics with Chart.js visualizations
  - Fleet count by model (Bar chart)
  - Status distribution (Doughnut chart)
  - Real-time statistics and metrics
- **Fleet List Management**: Sortable, filterable vehicle inventory with TanStack Table
- **Fleet Detail View**: Detailed vehicle information with maintenance history
- **Eagle Integration**: Real-time vehicle tracking and GPS data from Eagle IoT platform
- **Multi-Operator Support**: Separate fleet views for different car rental operators
- **Fleet Context**: Global state management for fleet data

### 🌦️ Weather Integration

- **Real-Time Weather**: Live Singapore weather data on Your Day page
- **Weather Icons**: Dynamic weather condition display
- **Personalized Dashboard**: Greeting based on time of day with weather context

### 🗺️ Interactive Mapping

- **Mapbox GL Integration**: High-performance interactive maps
- **Location Markers**: Display attractions, restaurants, and points of interest
- **Custom Styling**: Tailored map themes for Singapore locations
- **Runtime Configuration**: Dynamic Mapbox token loading via env.js

### 📱 Modern User Experience

- **About Page**: Professional company information with:
  - Hero section with image grid and GSAP animations
  - Mission statement and company values
  - Partner showcase (Singapore Tourism Board, Changi Airport, Gardens by the Bay, Marina Bay Sands, Sentosa)
  - Team member profiles with local assets
  - Scroll-triggered animations
- **White Theme Design**: Clean, modern aesthetic with gradient backgrounds
- **Responsive Footer**: Fluid typography with clamp() for perfect scaling across devices
- **Mobile-First Design**: Optimized layouts for all screen sizes
- **Smooth Animations**: GSAP-powered scroll animations and transitions
- **Loading States**: Skeleton loaders and progress indicators

### 🎯 Core Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS 4.x
- **Modern UI/UX**: Clean, professional interface with smooth transitions and hover effects
- **TypeScript Integration**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable React components with proper separation of concerns
- **Advanced Routing**: React Router DOM v7 with nested routes and protected routes
- **Performance Optimized**: Built with Vite for lightning-fast development and optimized production builds
- **Environment Configuration**: Runtime environment variables via public/env.js template
- **Docker Support**: Multi-stage Docker builds for development and production

## 🏗️ Project Architecture

```
exploresg-frontend-service/
├── public/                          # Static assets
│   ├── assets/                      # Car images and branding
│   │   ├── cars/                    # Vehicle photos
│   │   ├── cars-logo/               # Car brand logos
│   │   └── team/                    # Team member photos (sree.png, suhaas.png, shirley.png)
│   ├── env.template.js              # Runtime environment variable template
│   └── icon_s.png                   # Site favicon
├── src/
│   ├── app/
│   │   └── hooks/                   # Application-level hooks
│   ├── common/                      # Shared utilities
│   │   ├── data/                    # Common data structures
│   │   ├── icons/                   # Icon components
│   │   └── ui/                      # Common UI components
│   ├── components/                  # Reusable UI components
│   │   ├── Auth/                    # Authentication components
│   │   │   └── SocialLoginButtons.tsx # Google OAuth login button
│   │   ├── fleet/                   # Fleet management components
│   │   ├── Rentals/                 # Car rental components
│   │   │   ├── BookingProgress.tsx  # Multi-step progress indicator
│   │   │   ├── DriverDetailsPage.tsx # Driver information form
│   │   │   ├── RentalAddOn.tsx      # Add-ons selection page
│   │   │   └── RentalCard.tsx       # Individual car card component
│   │   ├── VehicleBrowse/           # Vehicle browsing components
│   │   ├── Weather/                 # Weather display components
│   │   ├── FeaturesSection.tsx      # Landing page features
│   │   ├── FleetPagination.tsx      # Fleet table pagination
│   │   ├── FleetSearchFilters.tsx   # Fleet filtering UI
│   │   ├── FleetTable.tsx           # Fleet data table (TanStack Table)
│   │   ├── Footer.tsx               # Responsive footer with fluid typography
│   │   ├── InlineLogoLoader.tsx     # Loading animations
│   │   ├── LoadingOverlay.tsx       # Full-page loading state
│   │   ├── Navbar.tsx               # Navigation with role-based links
│   │   ├── RoleBanner.tsx           # Debug banner (hidden in production)
│   │   ├── StatsSection.tsx         # Statistics display
│   │   ├── TestimonialCard.tsx      # Customer testimonials
│   │   ├── TestimonialsSection.tsx  # Testimonials carousel
│   │   └── VehicleDrawer.tsx        # Vehicle detail drawer
│   ├── config/                      # Configuration files
│   │   ├── api.ts                   # API endpoints and configuration
│   │   └── runtimeEnv.ts            # Runtime environment variables
│   ├── contexts/                    # React Context providers
│   │   ├── AuthContext.tsx          # Authentication provider
│   │   ├── AuthContextInstance.ts   # Auth context instance
│   │   ├── useAuth.ts               # useAuth hook
│   │   ├── BookingContext.tsx       # Booking state management
│   │   ├── BookingProvider.tsx      # Booking provider component
│   │   ├── bookingContext.ts        # Booking context types
│   │   ├── bookingContextCore.ts    # Booking core logic
│   │   ├── FleetContext.tsx         # Fleet state management
│   │   └── LoadingContext.tsx       # Global loading state
│   ├── data/                        # Static data and mock data
│   │   ├── fleetData.ts            # Fleet inventory data
│   │   ├── places.geojson.ts       # GeoJSON location data for maps
│   │   └── rentalCars.ts           # Rental car inventory
│   ├── domains/                     # Domain-driven design modules
│   │   ├── Auth/                    # Authentication domain
│   │   ├── Booking/                 # Booking domain
│   │   ├── Content/                 # Content management domain
│   │   └── Fleet/                   # Fleet management domain
│   ├── examples/                    # Example data and configurations
│   │   └── fleetSimulatorExamples.ts # Fleet simulation data
│   ├── features/                    # Feature modules
│   │   ├── auth/                    # Auth feature components
│   │   ├── fleet/                   # Fleet feature components
│   │   └── rentals/                 # Rentals feature components
│   ├── hooks/                       # Custom React hooks
│   │   ├── useFleetData.ts         # Fleet data fetching hook
│   │   └── useLoading.ts           # Loading state hook
│   ├── pages/                       # Page-level components
│   │   ├── AboutPage.tsx            # About page with GSAP animations
│   │   ├── AccessDeniedPage.tsx     # 403 access denied page
│   │   ├── AdminConsole.tsx         # Admin dashboard (ADMIN role)
│   │   ├── AttractionsPage.tsx      # Singapore attractions
│   │   ├── BookingFlow.tsx          # Booking flow orchestrator
│   │   ├── EagleViewPage.tsx        # Fleet tracking with Eagle integration
│   │   ├── EventsPage.tsx           # Events and festivals
│   │   ├── ExplorePage.tsx          # Explore Singapore with maps
│   │   ├── FleetAdminDashboardPage.tsx # Fleet analytics dashboard (FLEET_MANAGER)
│   │   ├── FleetAdminListPage.tsx   # Fleet list management (FLEET_MANAGER)
│   │   ├── FleetDetailPage.tsx      # Individual fleet vehicle details
│   │   ├── FleetListPage.tsx        # Fleet browsing (MANAGER+)
│   │   ├── FoodPage.tsx             # Dining experiences
│   │   ├── HomePage.tsx             # Landing page with hero section
│   │   ├── PaymentPage.tsx          # Payment processing
│   │   ├── ProfilePage.tsx          # User profile management
│   │   ├── SignInPage.tsx           # Sign-in with Google OAuth
│   │   ├── TestPage.tsx             # Development testing page
│   │   ├── UserVehicleBrowsePage.tsx # Customer vehicle browsing
│   │   └── YourDayPage.tsx          # Personalized dashboard with weather
│   ├── services/                    # API service layers
│   ├── shared/                      # Shared utilities and helpers
│   ├── types/                       # TypeScript type definitions
│   ├── utils/                       # Utility functions
│   │   └── jwtUtils.ts             # JWT decoding and role extraction
│   ├── App.css                      # Global application styles
│   ├── App.tsx                      # Main application with routing and RBAC
│   ├── index.css                    # Base styles and Tailwind imports
│   └── main.tsx                     # Application entry point with Google OAuth provider
├── docs/                            # Documentation
│   ├── AUTH-CONTEXT-FIX-SUMMARY.md  # Auth context refactoring docs
│   ├── DATA-FLOW-ARCHITECTURE.md    # Data flow patterns
│   ├── FLEET-ARCHITECTURE.md        # Fleet system architecture
│   ├── RBAC.md                      # Role-based access control documentation
│   └── ... (more documentation files)
├── .dockerignore                    # Docker ignore patterns
├── docker-compose.yml               # Docker Compose orchestration
├── Dockerfile                       # Production Docker build
├── Dockerfile.dev                   # Development Docker build
├── eslint.config.js                 # ESLint configuration
├── example.frontend.env             # Environment variable example
├── frontend.env                     # Environment variables
├── nginx.conf                       # Nginx configuration for production
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── README.md                        # This comprehensive documentation
```

## 🛠️ Technology Stack

### Frontend Core

- **React 19.1.1**: Latest React with concurrent features, modern hooks, and improved performance
- **TypeScript 5.8.3**: Full type safety and enhanced developer experience with strict mode
- **Vite 7.1.7**: Lightning-fast build tool with HMR and optimized bundling

### Authentication & API

- **@react-oauth/google 0.12.2**: Google OAuth 2.0 authentication integration
- **axios 1.12.2**: Promise-based HTTP client with interceptors and JWT Bearer token support
- **JWT Decoding**: Custom JWT utilities for token parsing and role extraction

### Styling & UI

- **Tailwind CSS 4.1.13**: Utility-first CSS framework with modern features and @tailwindcss/vite plugin
- **React Icons 5.5.0**: Comprehensive icon library (Font Awesome, Material Design, etc.)
- **GSAP 3.13.0**: Professional-grade animation library with ScrollTrigger for scroll-based animations
- **CSS clamp()**: Fluid typography for responsive text scaling across all viewports
- **Responsive Design**: Mobile-first approach with custom breakpoints and adaptive layouts

### Data Visualization & Charts

- **Chart.js 4.5.0**: Powerful charting library for fleet analytics
- **react-chartjs-2 5.3.0**: React wrapper for Chart.js with TypeScript support
- **react-countup 6.5.3**: Smooth number animations for statistics

### Mapping & Geolocation

- **Mapbox GL 3.15.0**: Interactive vector maps with WebGL rendering
- **@types/mapbox-gl 3.4.1**: TypeScript definitions for Mapbox GL
- **Custom Markers**: GeoJSON integration for location data

### State Management & Tables

- **@tanstack/react-table 8.21.3**: Headless table library for fleet management with sorting, filtering, and pagination
- **React Context API**: Custom contexts for Auth, Booking, Fleet, and Loading state
- **React Router State**: Location state for booking flow data persistence

### Routing & Navigation

- **React Router DOM 7.9.3**: Client-side routing with nested routes, loaders, and protected routes
- **Location State**: State management between route transitions
- **URL Parameters**: Dynamic routing for vehicle and fleet detail pages

### Development Tools

- **ESLint 9.36.0**: Code linting with React, TypeScript, and hooks rules
- **Prettier 3.6.2**: Automatic code formatting with Tailwind plugin
- **prettier-plugin-tailwindcss 0.6.14**: Automatic Tailwind class sorting
- **TypeScript ESLint 8.44.0**: Enhanced TypeScript linting with strict rules
- **@vitejs/plugin-react 5.0.3**: Fast Refresh and JSX optimization

### Containerization

- **Docker**: Multi-stage builds with development (Vite) and production (Nginx) configurations
- **Docker Compose**: Orchestration for both development and production environments
- **Nginx**: Production web server for serving static builds

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control

### 🐳 Running with Docker (Development & Production)

You can run the app in a container for both development (Vite dev server) and production (Nginx serving built files), both on port 3000.

#### 1. Development (Vite, hot reload)

**Option A: Using Docker Compose (recommended for local dev)**

Uses `Dockerfile.dev` and the `frontend-dev` service:

```powershell
docker-compose up --build frontend-dev
```

Visit: [http://localhost:3000](http://localhost:3000)

Any code changes will be reflected live in the browser.

**Option B: Using Docker directly**

```powershell
docker build -f Dockerfile.dev -t exploresg-frontend:dev .
docker run -it --rm -p 3000:3000 -v %cd%:/app -v /app/node_modules exploresg-frontend:dev
```

#### 2. Production (Nginx, static build)

**Option A: Using Docker Compose**

Uses `Dockerfile.prod` and the `frontend-prod` service:

```powershell
docker-compose up --build frontend-prod
```

Visit: [http://localhost:3000](http://localhost:3000)

**Option B: Using Docker directly**

```powershell
docker build -f Dockerfile.prod -t exploresg-frontend:prod .
docker run -it --rm -p 3000:3000 exploresg-frontend:prod
```

This serves the optimized static build using Nginx.

To stop any service, press `Ctrl+C` in the terminal.

---

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/XploreSG/exploresg-frontend-service.git
   cd exploresg-frontend-service
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001` (or the next available port).

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check for code issues
npm run format       # Format code with Prettier (if configured)

# TypeScript
npm run type-check   # Run TypeScript compiler check
```

## 📱 Application Routes

### Authentication Routes

- **`/signin`** - **Sign In Page**: Google OAuth authentication
- **`/signup`** - **Sign Up Page**: New user registration (role restricted to USER)

### Public Routes (No Authentication Required)

- **`/`** - **Home Page**: Hero section with features, testimonials, and navigation
- **`/about`** - **About Page**: Company information with mission, partners, and team
- **`/attractions`** - **Attractions**: Singapore tourist attractions and landmarks
- **`/food`** - **Food & Dining**: Culinary experiences and restaurant recommendations
- **`/events`** - **Events**: Festivals, events, and entertainment calendar
- **`/explore`** - **Explore Page**: Interactive Mapbox map with Singapore locations

### User Routes (Authenticated - USER Role)

- **`/your-day`** - **Your Day**: Personalized dashboard with weather and greetings
- **`/profile`** - **Profile**: User profile management
- **`/rentals`** - **Vehicle Browse**: Customer-facing car rental inventory with filtering and search

### Booking Flow Routes (Authenticated)

- **`/booking/:carId/addons`** - **Add-ons Selection**: Choose insurance and extras
- **`/booking/:carId/driver-details`** - **Driver Information**: Personal and license details
- **`/booking/:carId/payment`** - **Payment Processing**: Secure payment and booking confirmation

### Fleet Management Routes (FLEET_MANAGER Role)

- **`/fleet-admin-dashboard`** - **Fleet Dashboard**: Analytics, charts, and statistics
- **`/fleet-admin-list`** - **Fleet List**: Comprehensive fleet inventory management
- **`/fleet/:fleetId`** - **Fleet Detail**: Individual vehicle details and maintenance

### Manager Routes (MANAGER, SUPPORT, ADMIN Roles)

- **`/fleet-list`** - **Fleet List**: View and search all fleet vehicles across operators

### Admin Routes (ADMIN Role Only)

- **`/admin-console`** - **Admin Console**: System administration and user management
- **`/eagle-view`** - **Eagle View**: Real-time vehicle tracking and GPS integration

### Special Routes

- **`/access-denied`** - **Access Denied**: 403 error page for unauthorized access
- **`/test`** - **Test Page**: Development testing environment (development only)

## � Authentication & Role-Based Access Control (RBAC)

### Authentication Flow

1. **Google OAuth Sign-In**: Users authenticate via Google OAuth 2.0
2. **JWT Token Generation**: Backend issues JWT with user information and role
3. **Token Storage**: Token stored in localStorage with user information
4. **Protected Routes**: React Router guards routes based on user role
5. **Token Validation**: JWT decoded on client to extract role and permissions

### Role Hierarchy (5 Tiers)

1. **USER** (Default)
   - Browse vehicles
   - Make bookings
   - View personal profile
   - Access Your Day dashboard
   - View weather and personalized content

2. **FLEET_MANAGER** (Operator-Specific)
   - All USER permissions
   - View fleet analytics dashboard
   - Manage assigned fleet inventory
   - Access Eagle GPS tracking for assigned vehicles
   - View operator-specific statistics

3. **MANAGER** (Cross-Operator)
   - All USER permissions
   - View all fleets across operators
   - Search and filter all vehicles
   - Access comprehensive fleet lists

4. **SUPPORT**
   - All MANAGER permissions
   - Access support tools
   - View customer bookings
   - Assist with troubleshooting

5. **ADMIN** (Full Access)
   - All permissions across the system
   - Access admin console
   - User management
   - System configuration
   - Full Eagle tracking access
   - Cross-operator analytics

### Sign-Up Security

- New user accounts are restricted to **USER role only**
- Role dropdown is visible but disabled during sign-up
- Elevated roles (FLEET_MANAGER, MANAGER, SUPPORT, ADMIN) can only be assigned by administrators through backend systems
- This prevents privilege escalation during registration

### Protected Route Implementation

Routes are protected using custom `ProtectedRoute` wrapper components that:

- Check if user is authenticated
- Verify user has required role(s)
- Redirect to `/signin` if not authenticated
- Redirect to `/access-denied` if insufficient permissions

## 🚗 Car Rental System

### Customer Vehicle Browsing

The application features a customer-facing car rental system with:

#### Available Vehicles

- **Luxury Cars**: Mercedes SL63, BMW Z4, Porsche 911 Carrera
- **SUVs**: BMW X3, Maserati Grecale, Peugeot 5008
- **Sedans**: BMW 440i, Nissan Sentra, Skoda Octavia
- **Hybrids**: Toyota Prius
- **MPVs**: Toyota Alphard
- **Compact Cars**: Volkswagen Golf

#### Filtering Options

- **Price Range**: S$0 - S$1000+ per night with dynamic slider
- **Vehicle Type**: Sedan, SUV, Hybrid, Luxury, Compact, MPV
- **Seating Capacity**: 2, 4, 5, 7+ seats
- **Transmission**: Automatic, Manual
- **Sorting**: Price (Low to High/High to Low), Brand (A-Z/Z-A)
- **Search**: Real-time search by vehicle name or model

### Fleet Management System (FLEET_MANAGER+)

#### Fleet Dashboard Features

- **Analytics & Charts**:
  - Fleet count by model (Bar chart)
  - Vehicle status distribution (Doughnut chart)
  - Real-time fleet statistics
  - Operator-specific metrics
- **Operator Branding**: Custom styling per car rental operator
- **Real-Time Data**: Live updates from backend API
- **Responsive Charts**: Chart.js visualizations optimized for all devices

#### Fleet List Management

- **Advanced Table**: TanStack Table with sorting, filtering, pagination
- **Vehicle Status**: Available, Rented, Maintenance, Out of Service
- **Quick Actions**: View details, track location, update status
- **Search & Filter**: Multi-column search with real-time updates
- **Export Options**: CSV export for fleet reports

#### Eagle IoT Integration

- **Real-Time GPS Tracking**: Live vehicle location updates
- **Telematics Data**: Speed, fuel level, engine diagnostics
- **Fleet Tracking Dashboard**: Interactive map with vehicle markers
- **Historical Data**: Trip history and route playback

### Booking Process

#### Step 1: Car Selection (`/rentals`)

- Browse available vehicles with detailed specifications
- Apply filters to find the perfect car
- View pricing, features, and availability
- Click to proceed to add-ons selection

#### Step 2: Add-ons Selection (`/booking/:carId/addons`)

- **Insurance Options**:
  - CDW Basic (Included)
  - CDW Plus (+S$18/night)
  - CDW Max (+S$40/night)
- **Additional Services**:
  - Malaysia Entry Permission (FREE)
  - Windscreen Damage Protection (S$20)
  - Malaysia Breakdown Protection (S$30)
  - Child Booster Seat (S$25)
  - NETS Cash Card Rental (S$20)
- Real-time price calculation with selected options

#### Step 3: Driver Details (`/booking/:carId/driver-details`)

- Personal information (Name, Email, Phone)
- Date of birth and driving experience
- License details (Number, Expiry, Country)
- Emergency contact information
- Address and identification details
- Form validation with error handling

#### Step 4: Payment (`/booking/:carId/payment`)

- Booking summary with all selected options
- Secure payment form with validation
- Credit/Debit card processing
- Terms and conditions
- Booking confirmation

### Data Flow Architecture

The application uses multiple state management patterns:

#### Booking Flow State (React Router Location State)

1. **Car Selection**: Car details stored in navigation state
2. **Add-ons Page**: Receives car data, adds selection state
3. **Driver Details**: Collects user information, maintains booking state
4. **Payment**: Displays complete booking summary with all data

#### Authentication State (React Context + localStorage)

- **AuthContext**: Global authentication state with `useAuth()` hook
- **JWT Token**: Stored in localStorage, decoded for role extraction
- **User Information**: Name, email, profile picture from Google OAuth
- **Persistent Sessions**: Survives page refreshes via localStorage

#### Fleet State (FleetContext)

- **FleetContext**: Centralized fleet data management
- **API Integration**: axios calls with JWT Bearer token
- **Operator Filtering**: Automatic filtering for FLEET_MANAGER role
- **Real-Time Updates**: Periodic data refresh for live fleet status

#### Booking State (BookingContext)

- **BookingProvider**: Optional booking state management
- **Form Data Persistence**: Maintains form state across steps
- **Validation State**: Tracks form errors and validation status

## 🎨 Design System

### Color Palette

- **Primary**: Blue gradient (#3B82F6 to #1E40AF, #60A5FA)
- **Secondary**: Gray scale (#1F2937 to #F9FAFB, #F3F4F6, #E5E7EB)
- **Accent**: Red (#EF4444, #DC2626), Green (#10B981), Yellow (#F59E0B)
- **Text**: Dark gray (#111827) and light gray (#6B7280, #9CA3AF)
- **White Theme**: Clean white (#FFFFFF) with gradient backgrounds (gray-50, blue-50/30)

### Typography

- **Fluid Typography**: Uses CSS `clamp()` for responsive text scaling
  - Hero Headings: `clamp(2rem, 6vw, 4rem)` - scales from 32px to 64px
  - Section Headings: `clamp(1.5rem, 4vw, 2.25rem)` - scales from 24px to 36px
  - Body Text: `clamp(0.875rem, 2vw, 1rem)` - scales from 14px to 16px
- **Headers**: font-bold, font-semibold with various sizes (text-xl to text-5xl)
- **Body**: font-medium, text-sm to text-base
- **Labels**: font-medium, text-sm
- **Captions**: text-xs, text-gray-500

### Animation & Interactions

- **GSAP Animations**: Scroll-triggered animations with ScrollTrigger
  - Fade-in effects (opacity, y-transform)
  - Stagger animations for list items
  - Smooth easing with Power3
- **Hover Effects**: Transform scale, color transitions, shadow elevation
- **Loading States**: Skeleton loaders, spinners, progress bars
- **Transitions**: `transition-all`, `transition-colors` for smooth state changes

### Components Styling

- **Cards**: Rounded corners (rounded-xl, rounded-lg), shadows, hover lift effects
- **Buttons**: Gradient backgrounds, hover states, disabled states, focus rings
- **Forms**: Clean inputs with focus states, validation styling, error messages
- **Navigation**: Responsive design with mobile hamburger menu, active route highlighting
- **Tables**: Striped rows, hover highlights, sortable headers
- **Modals**: Backdrop blur, slide-in animations, close on outside click
- **Drawers**: Slide-from-side animations, backdrop overlay

### Responsive Design Breakpoints

- **Mobile**: `< 640px` (sm) - Single column, stacked layouts
- **Tablet**: `640px - 1024px` (sm - lg) - Two columns, optimized spacing
- **Desktop**: `> 1024px` (lg+) - Multi-column layouts, expanded content
- **Max Width**: `85rem` (1360px) for content containers

### Operator Branding (Fleet Management)

Dynamic color schemes for different car rental operators:

- **Primary Colors**: Custom per operator
- **Accent Colors**: Brand-specific highlights
- **Logo Integration**: Operator logos in dashboards

## 🔧 Configuration

### Tailwind CSS Configuration

The project uses Tailwind CSS 4.x with custom configurations for:

- Custom color scheme
- Responsive breakpoints
- Animation classes
- Component-specific utilities

### TypeScript Configuration

Strict TypeScript settings ensure code quality:

- Strict null checks
- No implicit any
- Unused variable detection
- Import/export validation

### ESLint Configuration

Comprehensive linting rules for:

- React best practices
- TypeScript conventions
- Code formatting
- Import organization

## 🚀 Deployment

### Building for Production

1. **Create Production Build**

   ```bash
   npm run build
   ```

2. **Test Production Build Locally**
   ```bash
   npm run preview
   ```

### Deployment Options

#### Static Hosting (Recommended)

- **Netlify**: Drag and drop `dist` folder or connect Git repo
- **Vercel**: Import project from GitHub/GitLab
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload `dist` contents to S3 bucket with CloudFront

#### Traditional Hosting

- **Apache/Nginx**: Upload `dist` contents to web server
- **Docker**: Create container with built files

### Environment Configuration

For different environments, create `.env` files:

```bash
# .env.development
VITE_API_URL=http://localhost:3001/api
VITE_PAYMENT_GATEWAY=sandbox

# .env.production
VITE_API_URL=https://api.exploresg.com
VITE_PAYMENT_GATEWAY=live
```

## 🧪 Testing Strategy

### Recommended Testing Setup

```bash
# Add testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Component Testing
# Test car card interactions, form validations, booking flow

# Integration Testing
# Test complete booking process, routing, state management

# E2E Testing
npm install --save-dev cypress
# Test full user journeys from car selection to payment
```

## 🛡️ Security Considerations

### Implemented Security Features

- **JWT Authentication**: Token-based authentication with Bearer tokens
- **Role-Based Access Control (RBAC)**: Five-tier permission system
- **Protected Routes**: Route guards checking authentication and role permissions
- **Secure Sign-Up**: New accounts restricted to USER role only
- **Google OAuth**: Delegated authentication to trusted provider
- **Token Storage**: JWT stored securely in localStorage
- **API Authorization**: All API calls include Authorization header
- **Form Validation**: Client-side validation for all user inputs
- **Type Safety**: TypeScript prevents runtime type errors
- **Environment Variables**: Sensitive configuration via runtime env.js
- **Production Mode**: Debug features (RoleBanner) hidden in production builds
- **Route Protection**: Booking flow requires proper navigation sequence

### Recommended Production Additions

- **Input Sanitization**: Sanitize all user inputs before processing
- **HTTPS Only**: Enforce HTTPS in production environments
- **CSP Headers**: Implement Content Security Policy headers
- **Rate Limiting**: API rate limiting to prevent abuse
- **Token Refresh**: Automatic JWT refresh before expiration
- **XSS Protection**: Additional XSS prevention headers
- **CORS Configuration**: Strict CORS policies on backend
- **Audit Logging**: Log authentication attempts and role changes
- **Session Timeout**: Auto-logout after inactivity period

## 📈 Performance Optimizations

### Current Optimizations

- **Vite Build**: Fast bundling with code splitting
- **Image Optimization**: Compressed car images
- **Lazy Loading**: Components loaded on demand
- **Responsive Images**: Different sizes for different viewports

### Recommended Improvements

- **Image CDN**: Serve images from CDN
- **Service Worker**: Offline functionality
- **Bundle Analysis**: Monitor bundle size
- **Performance Monitoring**: Real user monitoring

## 🔄 Future Enhancements

### Planned Features

- **Enhanced Authentication**:
  - Two-factor authentication (2FA)
  - Social login with Facebook, Apple
  - Email/password authentication option
  - Account recovery flow

- **Booking System**:
  - Booking history and management
  - Real-time availability calendar
  - Payment integration (Stripe/PayPal)
  - Email confirmations and reminders
  - Booking modifications and cancellations
  - Multi-language support

- **Fleet Management**:
  - Maintenance scheduling and tracking
  - Vehicle inspection reports
  - Damage documentation with photos
  - Insurance claim management
  - Driver assignment system
  - Fleet utilization analytics

- **User Experience**:
  - Reviews and ratings system
  - Loyalty program and rewards
  - Push notifications (PWA)
  - Offline functionality
  - Dark mode toggle
  - Accessibility improvements (WCAG 2.1 AA)

- **Advanced Features**:
  - AI-powered recommendation engine
  - Chatbot customer support
  - Price optimization algorithms
  - Demand forecasting
  - Mobile app (React Native)
  - Voice search integration

### Content Expansion

- **Attractions Module**: Complete Singapore attractions database with descriptions, hours, pricing
- **Events System**: Real-time events calendar with ticket booking integration
- **Food Directory**: Restaurant listings, reviews, reservations via OpenTable/Chope
- **Tour Packages**: Curated Singapore experiences with itinerary builder
- **Blog/Content**: Travel guides, tips, insider recommendations

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure all tests pass before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/XploreSG/exploresg-frontend-service/issues)
- **Documentation**: This README and inline code comments
- **Developer**: Contact the development team for technical support

---

## 🌐 API Integration

### Backend Endpoints

The frontend integrates with a RESTful API backend with the following endpoint categories:

- **Authentication**: `/api/auth/google` - Google OAuth authentication
- **User Management**: `/api/users/*` - User CRUD operations and profile management
- **Fleet Management**: `/api/fleet/*` - Fleet inventory, status, and analytics
- **Bookings**: `/api/bookings/*` - Booking creation, management, and history
- **Eagle IoT**: `/api/eagle/*` - Vehicle tracking and telematics data
- **Weather**: External weather API integration

### API Configuration

API base URLs are configured via runtime environment variables:

```javascript
// public/env.js
window._env_ = {
  VITE_API_BASE_URL: "https://api.exploresg.com",
  VITE_FLEET_API_BASE_URL: "https://api.exploresg.com/fleet",
  VITE_MAPBOX_TOKEN: "your_mapbox_token_here",
  VITE_APP_ENV: "production",
};
```

### Authentication Flow

All authenticated API requests include JWT Bearer token:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 🙏 Acknowledgments

- **React Team**: For the amazing React 19 framework with concurrent features
- **Tailwind Labs**: For Tailwind CSS 4.x and the utility-first philosophy
- **Vite Team**: For the lightning-fast build tool and excellent DX
- **TypeScript Team**: For type safety and enhanced developer experience
- **Google**: For Google OAuth 2.0 and authentication infrastructure
- **Mapbox**: For powerful mapping and geolocation services
- **GreenSock (GSAP)**: For professional animation capabilities
- **TanStack**: For the excellent react-table library
- **Chart.js**: For flexible and responsive charts
- **Singapore Tourism Board**: Inspiration for promoting Singapore's attractions
- **Eagle Telematics**: For IoT vehicle tracking integration

---

**Built with ❤️ in Singapore for Tourists and Locals**

_ExploreSG - Your Gateway to Discovering Singapore_
