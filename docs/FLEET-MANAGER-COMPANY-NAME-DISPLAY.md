# Fleet Manager Company Name & Brand Identity Display

## Overview

This document describes the implementation for displaying the company/operator name with branded s## Brand Styling Configuration

Each operator has unique brand colors and backgrounds defined in `OPERATOR_CONFIG`:

| Operator | ID  | Badge Styling                   | Background Styling                           |
| -------- | --- | ------------------------------- | -------------------------------------------- |
| Sixt     | 101 | `text-orange-600 bg-gray-200`   | `bg-black bg-blend-overlay bg-orange-800/70` |
| Hertz    | 102 | `text-yellow-600 bg-gray-200`   | `bg-black bg-blend-overlay bg-yellow-900/60` |
| Lylo     | 103 | `text-blue-600 bg-gray-200`     | `bg-black bg-blend-overlay bg-blue-900/80`   |
| Budget   | 104 | `text-red-600 bg-gray-200`      | `bg-black bg-blend-overlay bg-red-900/80`    |
| Avis     | 105 | `text-indigo-600 bg-indigo-200` | `bg-black bg-blend-overlay bg-indigo-900/80` |

### Styling Details

- **Dynamic Branding**: Each operator's badge and background automatically uses their brand colors
- **Full Page Background**: The entire dashboard page has the operator's branded background
- **Badge Visibility**: Badge is hidden on mobile screens (`hidden sm:flex`)
- **Position**: Displayed next to the ExploreSG logo in the navbar and on the dashboard
- **Text Contrast**: All section headers use white text for visibility on colored backgrounds
- **Consistency**: Same brand styling applies across all UI components
- **Immersive Experience**: The colored background creates a fully branded environmentANAGER users in the application's UI.

## Implementation Date

October 8, 2025

## Feature Description

When a user is logged in with the `FLEET_MANAGER` role, the application now:

1. Extracts the operator/company name and brand styling from the user's `userId` (which is a UUID)
2. **Applies the company's branded background** to the entire Fleet Admin Dashboard page
3. Displays the company name in the **Fleet Admin Dashboard** page title with a company-branded badge
4. Displays the company name in the **Navbar** next to the ExploreSG logo with company-branded styling
5. Each operator has their own unique brand identity reflected in colors, styling, and page backgrounds

## Technical Implementation

### 1. Added Utility Functions (`rental.ts`)

Added new utility functions to extract operator information from userId:

```typescript
// Get operator name only
export function getOperatorNameFromUserId(
  userId: string | undefined,
): string | null {
  if (!userId) return null;

  const config = OPERATOR_CONFIG[userId];
  return config ? config.name : null;
}

// Get full operator info (name + styling)
export function getOperatorInfoFromUserId(
  userId: string | undefined,
): { name: string; id: number; styling: OperatorStyling } | null {
  if (!userId) return null;

  const config = OPERATOR_CONFIG[userId];
  return config || null;
}
```

### 2. Updated FleetAdminDashboardPage

**File**: `src/pages/FleetAdminDashboardPage.tsx`

- Imported `useAuth` hook and `getOperatorInfoFromUserId` utility
- Added logic to extract operator info (name + styling) based on user's role and userId
- **Applied operator's branded background to the entire page** using `styling.background`
- Updated page title to include operator name with branded badge
- Changed all section headers to white text for better visibility on colored backgrounds
- Badge uses the operator's brand colors from `OPERATOR_CONFIG`

**Changes**:

```typescript
const { user, hasRole } = useAuth();

// Get operator info (name + styling) for FLEET_MANAGER users
const operatorInfo = hasRole("FLEET_MANAGER")
  ? getOperatorInfoFromUserId(typeof user?.userId === 'string' ? user.userId : undefined)
  : null;

// In the render - applies branded background to entire page:
<div
  className={`min-h-screen ${operatorInfo ? operatorInfo.styling.background : "bg-white"}`}
>
  <div className="container mx-auto px-4 py-8">
    <div className="mb-6 flex items-center gap-3">
      <h1 className="text-3xl font-bold text-white">
        {operatorInfo
          ? `${operatorInfo.name} Fleet Manager Dashboard`
          : "Fleet Manager Dashboard"}
      </h1>
      {operatorInfo && (
        <span className={`rounded-md px-3 py-1 text-sm font-semibold ${operatorInfo.styling.brand}`}>
          {operatorInfo.name}
        </span>
      )}
    </div>

    {/* All section headers use text-white for visibility */}
    <h2 className="mb-4 text-xl font-semibold text-white">
      Vehicle Status
    </h2>
    {/* ... rest of content */}
  </div>
</div>
```

### 3. Updated Navbar Component

**File**: `src/components/Navbar.tsx`

- Imported `getOperatorInfoFromUserId` utility
- Added memoized computation of operator info (name + styling)
- Displayed operator name badge next to the ExploreSG logo with brand-specific styling
- Each operator's badge uses their unique brand colors

**Changes**:

```typescript
// Get operator info (name + styling) for FLEET_MANAGER users
const operatorInfo = useMemo(() => {
  return hasRole("FLEET_MANAGER")
    ? getOperatorInfoFromUserId(typeof user?.userId === 'string' ? user.userId : undefined)
    : null;
}, [hasRole, user?.userId]);

// In the render:
{operatorInfo && (
  <div className={`hidden items-center rounded-md px-3 py-1 text-sm font-semibold sm:flex ${operatorInfo.styling.brand}`}>
    {operatorInfo.name}
  </div>
)}
```

## User Experience

### Before

- Generic "Fleet Manager Dashboard" title
- No indication of which operator/company the user represents

### After

For a FLEET_MANAGER user (e.g., with userId `92f04715-b828-4fc0-9013-81c3b468fcf1`):

- **Dashboard Background**: Full page has Hertz branded background `bg-black bg-blend-overlay bg-yellow-900/60`
- **Dashboard Title**: "Hertz Fleet Manager Dashboard" with a yellow-branded badge
- **Navbar**: Yellow-branded badge displaying "Hertz" next to the ExploreSG logo
- **Brand Colors**: Hertz uses `text-yellow-600 bg-gray-200` for badges and `bg-yellow-900/60` for backgrounds
- **Text Colors**: All section headers are white for visibility on the branded background

## Example User Context

```json
{
  "user": {
    "userId": "92f04715-b828-4fc0-9013-81c3b468fcf1",
    "givenName": "reshma",
    "familyName": "rajendran"
  },
  "primaryRole": "FLEET_MANAGER"
}
```

This userId maps to:

- **Operator**: Hertz
- **Operator ID**: 102

## Operator Mapping

The userId-to-operator mapping is defined in `OPERATOR_CONFIG` in `rental.ts`:

| UUID                                   | Operator Name | ID  |
| -------------------------------------- | ------------- | --- |
| `28dac4bd-e11a-4240-9602-c23fa8d8c510` | Sixt          | 101 |
| `92f04715-b828-4fc0-9013-81c3b468fcf1` | Hertz         | 102 |
| `ca9fd637-1c01-4ff8-9245-a0d41c910475` | Lylo          | 103 |
| `1c6a4a97-0608-41d4-b20d-e6cb023af975` | Budget        | 104 |
| `ddb04738-d252-4dcb-8d69-ecab0aee8072` | Avis          | 105 |

## Brand Styling Configuration

Each operator has unique brand colors defined in `OPERATOR_CONFIG`:

| Operator | ID  | Brand Styling                   | Colors      |
| -------- | --- | ------------------------------- | ----------- |
| Sixt     | 101 | `text-orange-600 bg-gray-200`   | Orange/Gray |
| Hertz    | 102 | `text-yellow-600 bg-gray-200`   | Yellow/Gray |
| Lylo     | 103 | `text-blue-600 bg-gray-200`     | Blue/Gray   |
| Budget   | 104 | `text-red-600 bg-gray-200`      | Red/Gray    |
| Avis     | 105 | `text-indigo-600 bg-indigo-200` | Indigo      |

### Styling Details

- **Dynamic Branding**: Each operator's badge automatically uses their brand colors
- **Visibility**: Badge is hidden on mobile screens (`hidden sm:flex`)
- **Position**: Displayed next to the ExploreSG logo in the navbar and on the dashboard
- **Consistency**: Same brand styling applies across all UI components

## Benefits

1. **Brand Identity**: Each operator maintains their unique brand identity throughout the application
2. **Immersive Experience**: Full-page branded backgrounds create a truly immersive company environment
3. **User Context**: Fleet managers immediately see which company they're managing
4. **Professional Appearance**: Consistent, polished branding across all interfaces
5. **Visual Distinction**: Different operators have distinctly different visual experiences
6. **Scalability**: Easy to add new operators with custom brand styling and backgrounds

## Notes

- Only applies to users with `FLEET_MANAGER` role
- Gracefully falls back to generic text if operator info cannot be determined
- Uses memoization in Navbar to prevent unnecessary recalculations
- Type-safe implementation with proper TypeScript type guards
- Brand styling is centrally managed in `OPERATOR_CONFIG` for easy maintenance
- Each operator can have custom colors that match their corporate identity
