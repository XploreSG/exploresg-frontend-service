[![CI Frontend - Build, Test & Security Scan](https://github.com/XploreSG/exploresg-frontend-service/actions/workflows/ci.yml/badge.svg)](https://github.com/XploreSG/exploresg-frontend-service/actions/workflows/ci.yml)

# 🚗 ExploreSG Frontend Service

A comprehensive React TypeScript application for exploring Singapore's attractions, car rentals, dining, and events. Built with modern web technologies and featuring a complete car rental booking system.

## 🌟 Overview

ExploreSG is a full-featured web application designed to help tourists and locals discover Singapore's offerings. The application includes a sophisticated car rental system with a multi-step booking process, dynamic fleet management, and responsive design optimized for all devices.

## ✨ Key Features

### 🚘 Car Rental System

- **Dynamic Fleet Management**: Browse and filter a comprehensive car inventory
- **Multi-Step Booking Process**: Streamlined booking flow with progress tracking
- **Real-Time Pricing**: Dynamic pricing calculation with add-ons and insurance options
- **Advanced Filtering**: Filter by price, vehicle type, seats, transmission, and more
- **Responsive Car Cards**: Interactive car cards with hover effects and animations
- **State Management**: Seamless data flow between booking steps using React Router state

### 🎯 Core Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional interface with smooth transitions
- **TypeScript Integration**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable React components
- **Routing System**: Advanced routing with React Router DOM v7
- **Performance Optimized**: Built with Vite for fast development and production builds

## 🏗️ Project Architecture

```
exploresg-frontend-service/
├── public/                          # Static assets
│   ├── assets/                      # Car images and media
│   │   ├── alphard.png              # Toyota Alphard
│   │   ├── bmw-440i.png             # BMW 440i
│   │   ├── bmw-x3.png               # BMW X3
│   │   ├── maserati-grecale.png     # Maserati Grecale
│   │   ├── merc-sl63.png            # Mercedes SL63
│   │   ├── porsche-911-c.png        # Porsche 911 Carrera
│   │   └── ... (more car assets)
│   └── vite.svg                     # Vite logo
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── assets/                  # Component-specific assets
│   │   │   └── alphard.png          # Local car asset
│   │   ├── Rentals/                 # Car rental components
│   │   │   ├── BookingProgress.tsx  # Multi-step progress indicator
│   │   │   ├── DriverDetailsPage.tsx # Driver information form
│   │   │   ├── RentalAddOn.tsx      # Add-ons selection page
│   │   │   └── RentalCard.tsx       # Individual car card component
│   │   ├── Footer.tsx               # Site footer with links
│   │   └── Navbar.tsx               # Navigation with responsive menu
│   ├── contexts/                    # React Context providers
│   │   └── BookingContext.tsx       # Booking state management (optional)
│   ├── data/                        # Static data and types
│   │   └── rentalCars.ts           # Car inventory data and TypeScript types
│   ├── pages/                       # Page-level components
│   │   ├── AboutPage.tsx            # About ExploreSG information
│   │   ├── AttractionsPage.tsx      # Singapore attractions (placeholder)
│   │   ├── EventsPage.tsx           # Events and festivals (placeholder)
│   │   ├── UserVehicleBrowsePage.tsx # Customer-facing vehicle browsing with filtering
│   │   ├── FoodPage.tsx             # Dining experiences (placeholder)
│   │   ├── HomePage.tsx             # Landing page with hero section
│   │   └── PaymentPage.tsx          # Payment processing and booking summary
│   ├── App.css                      # Global application styles
│   ├── App.tsx                      # Main application with routing setup
│   ├── index.css                    # Base styles and Tailwind imports
│   └── main.tsx                     # Application entry point
├── .eslintrc.js                     # ESLint configuration
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── README.md                        # This comprehensive documentation
```

## 🛠️ Technology Stack

### Frontend Core

- **React 19.1.1**: Latest React with concurrent features and modern hooks
- **TypeScript 5.8.3**: Full type safety and enhanced developer experience
- **Vite 7.1.7**: Lightning-fast build tool with HMR and optimized bundling

### Styling & UI

- **Tailwind CSS 4.1.13**: Utility-first CSS framework with modern features
- **React Icons 5.5.0**: Comprehensive icon library (Font Awesome, etc.)
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### Routing & Navigation

- **React Router DOM 7.9.3**: Client-side routing with advanced features
- **Location State**: State management between route transitions
- **URL Parameters**: Dynamic routing for car-specific pages

### Development Tools

- **ESLint 9.36.0**: Code linting with React and TypeScript rules
- **Prettier 3.6.2**: Code formatting with Tailwind plugin
- **TypeScript ESLint**: Enhanced TypeScript linting rules

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

### Public Routes

- **`/`** - **Home Page**: Hero section with feature overview and navigation
- **`/rentals`** - **Fleet Page**: Car inventory with advanced filtering and search
- **`/attractions`** - **Attractions**: Singapore tourist attractions (coming soon)
- **`/food`** - **Food & Dining**: Culinary experiences and restaurants (coming soon)
- **`/events`** - **Events**: Festivals and events calendar (coming soon)
- **`/about`** - **About Page**: Information about ExploreSG platform

### Booking Flow Routes

- **`/booking/:carId/addons`** - **Add-ons Selection**: Choose insurance and extras
- **`/booking/:carId/driver-details`** - **Driver Information**: Personal and license details
- **`/booking/:carId/payment`** - **Payment Processing**: Secure payment and booking confirmation

## 🚗 Car Rental System

### Fleet Management

The application features a comprehensive car rental system with:

#### Available Vehicles

- **Luxury Cars**: Mercedes SL63, BMW Z4, Porsche 911 Carrera
- **SUVs**: BMW X3, Maserati Grecale, Peugeot 5008
- **Sedans**: BMW 440i, Nissan Sentra, Skoda Octavia
- **Hybrids**: Toyota Prius
- **MPVs**: Toyota Alphard
- **Compact Cars**: Volkswagen Golf

#### Filtering Options

- **Price Range**: S$0 - S$1000+ per night
- **Vehicle Type**: Sedan, SUV, Hybrid, Luxury, Compact
- **Seating Capacity**: 2, 4, 5, 7+ seats
- **Transmission**: Automatic, Manual
- **Sorting**: Price (Low to High/High to Low), Brand (A-Z/Z-A)

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

The application uses React Router's location state for data persistence across the booking flow:

1. **Car Selection**: Car details stored in navigation state
2. **Add-ons Page**: Receives car data, adds selection state
3. **Driver Details**: Collects user information, maintains booking state
4. **Payment**: Displays complete booking summary with all data

## 🎨 Design System

### Color Palette

- **Primary**: Blue gradient (#3B82F6 to #1E40AF)
- **Secondary**: Gray scale (#1F2937 to #F9FAFB)
- **Accent**: Red (#EF4444), Green (#10B981), Yellow (#F59E0B)
- **Text**: Dark gray (#111827) and light gray (#6B7280)

### Typography

- **Headers**: font-bold, various sizes (text-xl to text-4xl)
- **Body**: font-medium, text-sm to text-base
- **Labels**: font-medium, text-sm
- **Captions**: text-xs, text-gray-500

### Components Styling

- **Cards**: Rounded corners (rounded-xl), shadows, hover effects
- **Buttons**: Gradient backgrounds, hover states, disabled states
- **Forms**: Clean inputs with focus states and validation styling
- **Navigation**: Responsive design with mobile hamburger menu

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

- **Form Validation**: Client-side validation for all user inputs
- **Type Safety**: TypeScript prevents runtime type errors
- **Route Protection**: Booking flow requires proper navigation sequence

### Recommended Additions

- **Input Sanitization**: Sanitize all user inputs before processing
- **HTTPS**: Enforce HTTPS in production
- **CSP Headers**: Implement Content Security Policy
- **Rate Limiting**: Prevent API abuse
- **Authentication**: User accounts and secure sessions

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

- **User Authentication**: Account creation and login system
- **Booking History**: View past and upcoming bookings
- **Real-time Availability**: Live car availability updates
- **Payment Integration**: Stripe/PayPal payment processing
- **Notifications**: Email confirmations and reminders
- **Reviews System**: Car and service ratings
- **Mobile App**: React Native version
- **Admin Dashboard**: Fleet management interface

### Content Expansion

- **Attractions Module**: Complete Singapore attractions database
- **Events System**: Real-time events and festivals
- **Food Directory**: Restaurant listings and reviews
- **Tour Packages**: Curated Singapore experiences

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

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite Team**: For the fast build tool
- **TypeScript Team**: For type safety and developer experience
- **Singapore Tourism**: Inspiration for promoting Singapore's attractions

---

**Built with ❤️ for Singapore Tourism**
