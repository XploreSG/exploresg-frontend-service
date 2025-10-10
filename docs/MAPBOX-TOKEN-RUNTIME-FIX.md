# Mapbox Token Runtime Fix

## Issue

`MAPBOX_TOKEN` was not being picked up at runtime (from Docker-injected `window._env_`), while `GOOGLE_CLIENT_ID` was working correctly.

## Root Cause

In `ExplorePage.tsx`, the Mapbox token was being set directly using:

```typescript
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
```

This approach only reads **build-time** environment variables from Vite and **ignores runtime-injected** values from `window._env_`.

## Why GOOGLE_CLIENT_ID Worked

`GOOGLE_CLIENT_ID` was using the centralized `getEnvVar()` function from `runtimeEnv.ts`:

```typescript
<GoogleOAuthProvider clientId={getEnvVar("GOOGLE_CLIENT_ID")}>
```

The `getEnvVar()` function implements a proper fallback chain:

1. ✅ **First**: Check runtime-injected `window._env_` (from Docker)
2. ✅ **Second**: Check build-time `import.meta.env.VITE_*`
3. ✅ **Third**: Use fallback default value

## Solution Applied

### Fixed Files

#### 1. `src/pages/ExplorePage.tsx`

**Before:**

```typescript
import mapboxgl from "mapbox-gl";
// ...
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
```

**After:**

```typescript
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../config/api";
// ...
mapboxgl.accessToken = MAPBOX_TOKEN;
```

#### 2. `src/pages/EagleViewPage.tsx`

Updated error message to clarify both runtime and build-time configuration options:

```typescript
MAPBOX_TOKEN is not configured. The map cannot be shown. Please set
MAPBOX_TOKEN in your environment (runtime: window._env_ or build-time: VITE_MAPBOX_TOKEN).
```

## How It Works Now

### Architecture Flow

```
Docker Container Startup
    ↓
docker-entrypoint.sh runs envsubst
    ↓
Generates /usr/share/nginx/html/env.js with window._env_
    ↓
index.html loads env.js before app bundle
    ↓
window._env_ = {
  MAPBOX_TOKEN: "pk.actual_token...",
  GOOGLE_CLIENT_ID: "...",
  ...
}
    ↓
App loads and calls getEnvVar("MAPBOX_TOKEN")
    ↓
getEnvVar checks window._env_.MAPBOX_TOKEN first ✅
    ↓
Falls back to import.meta.env.VITE_MAPBOX_TOKEN if needed
    ↓
MAPBOX_TOKEN exported from api.ts
    ↓
Used in ExplorePage.tsx and EagleViewPage.tsx
```

### Configuration Sources (Priority Order)

1. **Runtime (Docker)**: `window._env_.MAPBOX_TOKEN` - Injected via `docker-entrypoint.sh`
2. **Build-time (Vite)**: `import.meta.env.VITE_MAPBOX_TOKEN` - From `.env` files
3. **Fallback**: Empty string (default)

## Testing Verification

### Check Runtime Values

Open browser console and run:

```javascript
console.log(window._env_);
// Should show: { MAPBOX_TOKEN: "pk.eyJ1...", ... }
```

### Check Resolved Environment

The app logs resolved env values on startup (with masking):

```javascript
Resolved environment (masked): {
  API_BASE_URL: "http://localhost:8080",
  FLEET_API_BASE_URL: "http://localhost:8081",
  GOOGLE_CLIENT_ID: "18271569...22qqi7",
  MAPBOX_TOKEN: "pk.eyJ...EY3qA", // ✅ Now properly resolved
  APP_ENV: "production",
  DEBUG: "false"
}
```

## Files Changed

- ✅ `src/pages/ExplorePage.tsx` - Use centralized `MAPBOX_TOKEN` from `api.ts`
- ✅ `src/pages/EagleViewPage.tsx` - Updated error message for clarity

## Files Already Correct

- ✅ `src/config/runtimeEnv.ts` - Contains `getEnvVar()` function
- ✅ `src/config/api.ts` - Exports `MAPBOX_TOKEN` using `getEnvVar()`
- ✅ `src/pages/EagleViewPage.tsx` - Already using `MAPBOX_TOKEN` from `api.ts`
- ✅ `docker-entrypoint.sh` - Properly injects runtime env
- ✅ `public/env.template.js` - Contains `MAPBOX_TOKEN: "$MAPBOX_TOKEN"`
- ✅ `index.html` - Loads `env.js` before app bundle

## Best Practices Going Forward

### ✅ DO: Use Centralized Configuration

```typescript
import { MAPBOX_TOKEN } from "../config/api";
mapboxgl.accessToken = MAPBOX_TOKEN;
```

### ❌ DON'T: Access import.meta.env Directly

```typescript
// ❌ This only works at build-time, ignores runtime injection
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
```

### ✅ DO: Use getEnvVar() for New Variables

```typescript
import { getEnvVar } from "./config/runtimeEnv";
const NEW_TOKEN = getEnvVar("NEW_TOKEN");
```

## Related Documentation

- `docs/ENV-VAR-CONSOLIDATION.md` - Environment variable consolidation strategy
- `src/config/runtimeEnv.ts` - Runtime environment handling
- `src/config/api.ts` - Centralized API configuration
