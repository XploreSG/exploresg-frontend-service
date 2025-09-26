# Google OAuth Session Behavior

## Why Login Becomes Fast After First Login

When you notice that subsequent logins are very fast and don't show the Google login page, this is **normal Google OAuth behavior**, not a bug in your application.

### What's Happening

1. **First Login**: User sees Google login page, enters credentials, grants permissions
2. **Google Session Created**: Google creates a session in the user's browser
3. **Subsequent Logins**: Google recognizes the existing session and automatically signs the user in

### This is Good UX!

Google designed this behavior to:

- ✅ Reduce friction for returning users
- ✅ Provide seamless authentication experience
- ✅ Eliminate repetitive login prompts

## When You Might Want Different Behavior

### For Testing/Development

If you're testing and want to see the Google login page every time:

```tsx
// Force account selection every time
<GoogleSSOButton forceAccountSelection={true} />
```

### For Multi-Account Support

If your app supports multiple Google accounts:

```tsx
// Let users choose which account to use
<GoogleSSOButton forceAccountSelection={true} />
```

## Implementation Details

### Default Behavior

```tsx
// Uses existing Google session if available
<GoogleSSOButton />
// Equivalent to: prompt=consent (or no prompt parameter)
```

### Force Account Selection

```tsx
// Always shows account selection screen
<GoogleSSOButton forceAccountSelection={true} />
// Equivalent to: prompt=select_account
```

### Backend URL Parameters

The `forceAccountSelection` prop adds `prompt=select_account` to the OAuth URL:

```
Default: http://localhost:8080/api/v1/auth/login
With force: http://localhost:8080/api/v1/auth/login?prompt=select_account
```

## Testing Different Behaviors

1. **Test Normal Flow**: Use default button, should be fast after first login
2. **Test Forced Selection**: Use `forceAccountSelection={true}`, always shows Google page
3. **Clear Session**: Open incognito window or clear browser data to test first-time flow

## Summary

- Fast re-login = **Normal Google OAuth behavior** ✅
- Use `forceAccountSelection={true}` when you need explicit account selection
- Default behavior provides the best user experience for most cases
