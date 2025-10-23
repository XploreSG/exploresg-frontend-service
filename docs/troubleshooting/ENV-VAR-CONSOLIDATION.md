# Environment Variable Logic Consolidation

## Overview

This document describes the refactoring done to consolidate duplicated environment variable logic across the application.

## Problem

The `getEnvVar` function was duplicated in both `api.ts` and `runtimeEnv.ts` with slight variations, creating:

- Code duplication
- Potential inconsistencies
- Maintenance overhead
- Risk of bugs when updating logic in one place but not the other

## Solution

Consolidated all environment variable logic into `runtimeEnv.ts` as the single source of truth.

### File Changes

#### 1. `src/config/runtimeEnv.ts` (Source of Truth)

**Added:**

- Comprehensive `getEnvVar()` function with unified fallback chain:
  1. Runtime-injected env (from `window._env_`)
  2. Build-time Vite env (from `import.meta.env`)
  3. Default fallback value
- JSDoc documentation for all exported functions
- Deprecated `getGoogleClientId()` marked as legacy (kept for backward compatibility)

**Updated:**

- `getResolvedEnv()` now uses `getEnvVar()` internally for consistency

#### 2. `src/config/api.ts` (Consumer)

**Removed:**

- Duplicate `getEnvVar` function definition
- Duplicate `EnvWindow` interface
- ~30 lines of redundant code

**Added:**

- Import statement: `import { getEnvVar } from "./runtimeEnv"`

#### 3. `src/main.tsx` (Consumer)

**Updated:**

- Changed from `getGoogleClientId()` to `getEnvVar("GOOGLE_CLIENT_ID")`
- More explicit and consistent with other env var usage

## Benefits

### ✅ Code Quality

- **Single Source of Truth**: All env var logic in one place
- **DRY Principle**: Eliminated ~30 lines of duplicate code
- **Consistency**: Same behavior across all consumers

### ✅ Maintainability

- Changes only need to be made in one place
- Easier to test and debug
- Clear documentation with JSDoc comments

### ✅ Type Safety

- Shared TypeScript types ensure consistency
- Better IDE autocomplete support

### ✅ Backward Compatibility

- Deprecated functions kept for gradual migration
- No breaking changes to existing code

## Usage Examples

### Basic Usage

```typescript
import { getEnvVar } from "./config/runtimeEnv";

// With default fallback
const apiUrl = getEnvVar("API_BASE_URL", "http://localhost:8080");

// Without fallback (returns empty string if not found)
const mapboxToken = getEnvVar("MAPBOX_TOKEN");
```

### In Components

```tsx
import { getEnvVar } from "../config/runtimeEnv";

function MyComponent() {
  const googleClientId = getEnvVar("GOOGLE_CLIENT_ID");
  // ...
}
```

### Get All Resolved Values

```typescript
import { getResolvedEnv } from "./config/runtimeEnv";

const env = getResolvedEnv();
console.log(env.API_BASE_URL);
console.log(env.GOOGLE_CLIENT_ID);
```

## Testing

### Build Verification

```bash
npm run build
```

✅ Build succeeds with no TypeScript errors

### Runtime Verification

1. **Local Development** (Vite env vars):

   ```bash
   npm run dev
   ```

   - Reads from `.env.local` or `.env` files
   - Uses `import.meta.env.VITE_*` variables

2. **Docker Production** (Runtime injection):
   ```bash
   docker compose up
   ```

   - Reads from `window._env_` (injected by `docker-entrypoint.sh`)
   - Falls back to build-time values if runtime values not available

## Migration Guide

### For New Code

Always use `getEnvVar()` from `runtimeEnv.ts`:

```typescript
import { getEnvVar } from "./config/runtimeEnv";
const value = getEnvVar("KEY_NAME", "default");
```

### For Existing Code

**Deprecated (but still works):**

```typescript
import { getGoogleClientId } from "./config/runtimeEnv";
const clientId = getGoogleClientId();
```

**Recommended:**

```typescript
import { getEnvVar } from "./config/runtimeEnv";
const clientId = getEnvVar("GOOGLE_CLIENT_ID");
```

## Future Improvements

1. **Remove Deprecated Functions**: After confirming no external dependencies
2. **Add Unit Tests**: Test the fallback chain behavior
3. **Environment Validation**: Add runtime checks for required variables
4. **Type-Safe Keys**: Use string literal union types for env var keys

## Related Files

- `src/config/runtimeEnv.ts` - Source of truth for env var logic
- `src/config/api.ts` - API configuration (consumer)
- `src/main.tsx` - App entry point (consumer)
- `public/env.template.js` - Runtime env template for Docker
- `docker-entrypoint.sh` - Runtime env injection script

## Rollback Plan

If issues arise, revert these commits:

```bash
git log --oneline src/config/runtimeEnv.ts src/config/api.ts src/main.tsx
```

---

**Date**: October 11, 2025  
**Impact**: Low risk - backward compatible refactoring  
**Testing**: ✅ Build verified, no TypeScript errors
