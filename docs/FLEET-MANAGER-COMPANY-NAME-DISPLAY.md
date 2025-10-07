# Fleet Manager Company Name Display

## Overview

This document describes the implementation for displaying the company/operator name for FLEET_MANAGER users in the application's UI.

## Implementation Date

October 8, 2025

## Feature Description

When a user is logged in with the `FLEET_MANAGER` role, the application now:

1. Extracts the operator/company name from the user's `userId` (which is a UUID)
2. Displays the company name in the **Fleet Admin Dashboard** page title
3. Displays the company name in the **Navbar** next to the ExploreSG logo

## Technical Implementation

### 1. Added Utility Function (`rental.ts`)

Added a new utility function to extract operator name from userId:

```typescript
export function getOperatorNameFromUserId(
  userId: string | undefined,
): string | null {
  if (!userId) return null;

  const config = OPERATOR_CONFIG[userId];
  return config ? config.name : null;
}
```

### 2. Updated FleetAdminDashboardPage

**File**: `src/pages/FleetAdminDashboardPage.tsx`

- Imported `useAuth` hook and `getOperatorNameFromUserId` utility
- Added logic to extract operator name based on user's role and userId
- Updated page title to include operator name: `"${operatorName} Fleet Manager Dashboard"`

**Changes**:

```typescript
const { user, hasRole } = useAuth();

// Get operator name for FLEET_MANAGER users
const operatorName = hasRole("FLEET_MANAGER")
  ? getOperatorNameFromUserId(typeof user?.userId === 'string' ? user.userId : undefined)
  : null;

// In the render:
<h1 className="mb-6 text-3xl font-bold">
  {operatorName ? `${operatorName} Fleet Manager Dashboard` : 'Fleet Manager Dashboard'}
</h1>
```

### 3. Updated Navbar Component

**File**: `src/components/Navbar.tsx`

- Imported `getOperatorNameFromUserId` utility
- Added memoized computation of operator name
- Displayed operator name badge next to the ExploreSG logo

**Changes**:

```typescript
// Get operator name for FLEET_MANAGER users
const operatorName = useMemo(() => {
  return hasRole("FLEET_MANAGER")
    ? getOperatorNameFromUserId(typeof user?.userId === 'string' ? user.userId : undefined)
    : null;
}, [hasRole, user?.userId]);

// In the render:
{operatorName && (
  <div className="hidden items-center rounded-md bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800 sm:flex">
    {operatorName}
  </div>
)}
```

## User Experience

### Before

- Generic "Fleet Manager Dashboard" title
- No indication of which operator/company the user represents

### After

For a FLEET_MANAGER user (e.g., with userId `92f04715-b828-4fc0-9013-81c3b468fcf1`):

- **Dashboard Title**: "Hertz Fleet Manager Dashboard"
- **Navbar**: Orange badge displaying "Hertz" next to the ExploreSG logo

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

## Styling

- **Navbar Badge**: Orange background (`bg-orange-100`) with orange text (`text-orange-800`)
- **Visibility**: Badge is hidden on mobile screens (`hidden sm:flex`)
- **Position**: Displayed next to the ExploreSG logo in the navbar

## Notes

- Only applies to users with `FLEET_MANAGER` role
- Gracefully falls back to generic text if operator name cannot be determined
- Uses memoization in Navbar to prevent unnecessary recalculations
- Type-safe implementation with proper TypeScript type guards
