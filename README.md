# ExploreSG Frontend Service

A clean React application for exploring Singapore's attractions, transport options, and events.

## 🚀 Features

- **Clean Architecture**: Simple React + TypeScript + Vite setup
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **Navigation**: React Router DOM for seamless page transitions
- **Modern UI**: Professional navbar, footer, and placeholder pages

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx      # Navigation header with responsive menu
│   └── Footer.tsx      # Site footer with links
├── pages/
│   ├── HomePage.tsx    # Landing page with hero section
│   ├── AttractionsPage.tsx  # Attractions placeholder
│   ├── FoodPage.tsx    # Food & dining placeholder
│   ├── EventsPage.tsx  # Events placeholder
│   └── AboutPage.tsx   # About page
└── App.tsx             # Main app with routing
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router DOM
- **Build Tool**: Vite with HMR
- **Linting**: ESLint with TypeScript support

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

Visit `http://localhost:3000` to view the application.

## 📱 Pages

- **Home** (`/`) - Hero section with feature overview
- **Attractions** (`/attractions`) - Singapore attractions placeholder
- **Food & Dining** (`/food`) - Culinary experiences placeholder
- **Events** (`/events`) - Events and festivals placeholder
- **About** (`/about`) - About ExploreSG page

## 🎨 Styling

The application uses Tailwind CSS 4.x with:

- Responsive design (mobile-first)
- Red accent color scheme
- Clean, modern typography
- Hover effects and transitions

## 🚀 Deployment

Build the project and deploy the `dist` folder to any static hosting service:

```bash
npm run build
```

The built files will be in the `dist` directory.
