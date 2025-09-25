# ExploreSG Frontend Service - Google SSO Integration

This React TypeScript application includes Google SSO authentication integration with the ExploreSG backend service.

## Features

- **Google OAuth Integration**: Secure login using Google accounts
- **JWT Token Management**: Automatic token handling and validation
- **User Context**: Global user state management with React Context
- **Styled Components**: Beautiful UI with Tailwind CSS
- **Backend Health Check**: Connection testing with backend services

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

3. **Backend Requirements**
   - Make sure the ExploreSG backend is running on `http://localhost:8080`
   - Backend should expose the following endpoints:
     - `GET /api/v1/auth/health` - Health check
     - `GET /api/v1/auth/login` - Start Google OAuth (redirects)
     - `GET /api/v1/auth/me` - Get current user (requires JWT)
     - `POST /api/v1/auth/validate` - Validate JWT token
     - `POST /api/v1/auth/logout` - Logout user

## Project Structure

```
src/
├── components/
│   ├── LoginButton.tsx       # Google SSO login/logout button
│   └── TestConnection.tsx    # Backend connection test
├── contexts/
│   └── AuthContext.tsx       # Authentication context provider
├── hooks/
│   └── useAuth.ts           # Authentication hook
├── services/
│   └── authService.ts       # Backend API service
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## How It Works

### Authentication Flow

1. **Login**: User clicks "Continue with Google" button
2. **Redirect**: Browser redirects to backend OAuth endpoint
3. **Google OAuth**: Backend handles Google authentication
4. **Callback**: Backend redirects back with JWT token in URL
5. **Token Storage**: Frontend stores JWT in localStorage
6. **User Data**: Frontend fetches user information using JWT
7. **Protected State**: User remains logged in across browser sessions

### Components

#### LoginButton

- Shows "Continue with Google" when logged out
- Displays user info and logout button when logged in
- Includes Google branding and loading states

#### TestConnection

- Tests connectivity to the backend service
- Shows connection status and health data
- Useful for debugging backend issues

#### AuthProvider

- Manages global authentication state
- Handles token detection from URL parameters
- Provides login/logout functions to child components

### Backend Integration

The `authService` handles all backend communication:

- **Health Check**: Verifies backend is running
- **Google Login**: Redirects to backend OAuth endpoint
- **Token Management**: Stores/retrieves JWT from localStorage
- **User Data**: Fetches current user information
- **Token Validation**: Verifies JWT validity
- **Logout**: Clears session and token

## Environment Configuration

The backend URL is currently hardcoded to `http://localhost:8080`. For production deployment, consider:

1. Using environment variables:

   ```typescript
   private baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1/auth';
   ```

2. Adding to `.env` file:
   ```
   VITE_BACKEND_URL=https://your-backend-domain.com/api/v1/auth
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Styling

The application uses Tailwind CSS for styling with a clean, modern design:

- **Responsive**: Works on mobile and desktop
- **Accessible**: Proper focus states and ARIA labels
- **Google Branding**: Official Google colors and logo
- **Loading States**: Spinner animations for async operations

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API calls include proper authentication headers
- Token validation happens on page load
- Automatic logout on token errors

## Troubleshooting

1. **Backend Connection Issues**:
   - Use the "Test Backend Connection" button
   - Check if backend is running on port 8080
   - Verify CORS settings allow frontend origin

2. **Authentication Issues**:
   - Clear localStorage to reset auth state
   - Check browser console for error messages
   - Verify Google OAuth is configured in backend

3. **Build Issues**:
   - Run `npm install` to ensure dependencies are installed
   - Check TypeScript errors with `npm run build`
   - Verify all imports are correct
