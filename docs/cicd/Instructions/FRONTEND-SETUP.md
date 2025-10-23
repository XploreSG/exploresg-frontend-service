<!-- SETUP -->
# ExploreSG Frontend - Production Environment Variables
# These variables are injected at runtime by Docker via docker-entrypoint.sh

# -----------------------------------------------------------------------------
# API Configuration
# -----------------------------------------------------------------------------
# Production uses a single API gateway with different route prefixes:
# - https://api.xplore.town/booking  (Booking service)
# - https://api.xplore.town/fleet    (Fleet service)
# - https://api.xplore.town/payment  (Payment service)

# Main API URL (no trailing slash)
API_BASE_URL=https://api.xplore.town/auth

# Fleet API URL - same base, different route
FLEET_API_BASE_URL=https://api.xplore.town/fleet

# Booking API URL - same base, different route
BOOKING_API_BASE_URL=https://api.xplore.town/booking
PAYMENT_API_BASE_URL=https://api.xplore.town/payment

# -----------------------------------------------------------------------------
# Authentication & Third-Party Services
# -----------------------------------------------------------------------------
# Google OAuth 2.0 Client ID (Production)
GOOGLE_CLIENT_ID=182715694192-6q156lo1066sf1vi4o99kmfd1b22qqi7.apps.googleusercontent.com

# Mapbox Public Access Token
MAPBOX_TOKEN=pk.eyJ1Ijoic3JlZS1yLW9uZSIsImEiOiJjbTY1OTJjemQxc25zMmpvdWQ2MWN2aDlvIn0.VMrL_nkV5-W7-T4AcEY3qA

# -----------------------------------------------------------------------------
# Environment Settings
# -----------------------------------------------------------------------------
APP_ENV=production
DEBUG=false
VITE_DEBUG=false
APP_VERSION=1.0.0