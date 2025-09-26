# Google SSO Components for ExploreSG

This project includes comprehensive Google SSO button components built with React, TypeScript, and Tailwind CSS.

## 🎨 Components Overview

### 1. GoogleSSOButton

The main reusable Google SSO button component with multiple variants and sizes.

**Location:** `src/components/GoogleSSOButton.tsx`

**Props:**

```typescript
interface GoogleSSOButtonProps {
  onClick?: () => void; // Custom click handler
  loading?: boolean; // Show loading spinner
  disabled?: boolean; // Disable the button
  className?: string; // Additional CSS classes
  size?: "sm" | "md" | "lg"; // Button size
  variant?: "filled" | "outlined"; // Button style variant
}
```

**Basic Usage:**

```typescript
import GoogleSSOButton from './components/GoogleSSOButton';

// Simple usage - redirects to backend automatically
<GoogleSSOButton />

// With custom handler
<GoogleSSOButton
  onClick={() => console.log('Custom login logic')}
  size="lg"
  className="w-full"
/>
```

### 2. LoginPage

A complete login page component with beautiful design.

**Location:** `src/pages/LoginPage.tsx`

**Features:**

- Gradient background
- Centered card layout
- Responsive design
- Terms of Service links

### 3. LoginButton (Enhanced)

Enhanced version of the existing login button that uses GoogleSSOButton internally.

**Location:** `src/components/LoginButton.tsx`

**Features:**

- Loading state management
- User authentication display
- Debug information
- Logout functionality

### 4. GoogleSSOExamples

A showcase component demonstrating all the different ways to use GoogleSSOButton.

**Location:** `src/components/GoogleSSOExamples.tsx`

## 🚀 Quick Start

1. **Install Dependencies:**

```bash
npm install react react-dom typescript @types/react @types/react-dom
npm install -D tailwindcss
```

2. **Import and Use:**

```typescript
import GoogleSSOButton from './components/GoogleSSOButton';

function App() {
  return (
    <div>
      <GoogleSSOButton size="lg" className="w-full" />
    </div>
  );
}
```

## 📏 Size Variants

| Size | Padding     | Text Size   | Use Case                           |
| ---- | ----------- | ----------- | ---------------------------------- |
| `sm` | `px-4 py-2` | `text-sm`   | Compact layouts, secondary actions |
| `md` | `px-6 py-3` | `text-base` | Default size, most common use      |
| `lg` | `px-8 py-4` | `text-lg`   | Primary actions, login pages       |

## 🎭 Style Variants

### Filled (Default)

```typescript
<GoogleSSOButton variant="filled" />
```

- White background
- Gray border
- Shadow effect
- Hover states

### Outlined

```typescript
<GoogleSSOButton variant="outlined" />
```

- Transparent background
- Thicker border
- No shadow
- Hover states

## 🔄 States

### Normal State

```typescript
<GoogleSSOButton />
```

### Loading State

```typescript
<GoogleSSOButton loading={true} />
```

- Shows spinner animation
- "Signing in..." text
- Disabled interaction

### Disabled State

```typescript
<GoogleSSOButton disabled={true} />
```

- Reduced opacity
- No interaction
- Cursor not allowed

## 🌐 Integration with Backend

The components are designed to work with your Spring Boot OAuth2 backend:

1. **Frontend Button Click** → Redirects to `http://localhost:8080/api/v1/auth/login`
2. **Spring Boot** → Redirects to Google OAuth2
3. **Google Authentication** → User grants permission
4. **Google** → Redirects back to Spring Boot with auth code
5. **Spring Boot** → Exchanges code for tokens, creates JWT
6. **Spring Boot** → Redirects to React app with JWT: `http://localhost:3000/auth/success?token=JWT&userId=123...`
7. **React App** → Captures JWT from URL parameters and stores it

## 📱 Responsive Design

All components are built with responsive design principles:

- Mobile-first approach
- Proper touch targets (minimum 44px)
- Scalable layouts
- Accessible focus states

## ♿ Accessibility Features

- Proper focus management
- Keyboard navigation support
- ARIA labels and roles
- High contrast support
- Screen reader friendly

## 🎨 Customization

### Custom Styling

```typescript
<GoogleSSOButton
  className="custom-class bg-blue-500 hover:bg-blue-600"
  size="lg"
/>
```

### Custom Click Handler

```typescript
const handleLogin = () => {
  // Add analytics tracking
  analytics.track('login_attempt');

  // Add loading state management
  setLoading(true);

  // Redirect to backend
  window.location.href = 'http://localhost:8080/api/v1/auth/login';
};

<GoogleSSOButton onClick={handleLogin} />
```

## 🧪 Testing

The components are built with testing in mind:

```typescript
import { render, fireEvent } from '@testing-library/react';
import GoogleSSOButton from './GoogleSSOButton';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <GoogleSSOButton onClick={handleClick} />
  );

  fireEvent.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

## 📦 Files Structure

```
src/
├── components/
│   ├── GoogleSSOButton.tsx       # Main SSO button component
│   ├── GoogleSSOExamples.tsx     # Usage examples showcase
│   └── LoginButton.tsx           # Enhanced login button
├── pages/
│   └── LoginPage.tsx             # Complete login page
└── services/
    └── authService.ts            # Authentication service
```

## 🎯 Best Practices

1. **Use appropriate sizes:** `lg` for primary actions, `md` for secondary, `sm` for compact layouts
2. **Handle loading states:** Always show feedback during authentication
3. **Error handling:** Implement proper error boundaries
4. **Analytics:** Track authentication events
5. **Security:** Never log sensitive information like tokens

## 🔧 Configuration

Update the backend URL in `GoogleSSOButton.tsx`:

```typescript
// Change this to your backend URL
window.location.href = "https://your-backend.com/api/v1/auth/login";
```

## 🎉 Features Summary

✅ **Beautiful Design** - Official Google colors and styling  
✅ **Fully Responsive** - Works on all screen sizes  
✅ **TypeScript Support** - Full type safety  
✅ **Multiple Variants** - Different sizes and styles  
✅ **Loading States** - Proper user feedback  
✅ **Accessibility** - WCAG compliant  
✅ **Customizable** - Easy to modify and extend  
✅ **Testing Ready** - Built with testing in mind

## 🤝 Contributing

When adding new features:

1. Maintain TypeScript types
2. Follow the existing design patterns
3. Add proper accessibility attributes
4. Update this documentation
5. Add tests for new functionality
