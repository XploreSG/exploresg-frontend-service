# Fleet Manager Brand Identity Examples

## Overview

This document provides visual examples of how different operators' brand identities are displayed in the application.

## Operator Brand Styles

### 1. Sixt (ID: 101)

**UUID**: `28dac4bd-e11a-4240-9602-c23fa8d8c510`

**Brand Colors**:

- Text: `text-orange-600`
- Background: `bg-gray-200`

**Example Display**:

```
Dashboard: "Sixt Fleet Manager Dashboard" [Sixt]
                                         Orange badge
Navbar: ExploreSG [Sixt]
                 Orange badge
```

---

### 2. Hertz (ID: 102)

**UUID**: `92f04715-b828-4fc0-9013-81c3b468fcf1`

**Brand Colors**:

- Text: `text-yellow-600`
- Background: `bg-gray-200`

**Example Display**:

```
Dashboard: "Hertz Fleet Manager Dashboard" [Hertz]
                                           Yellow badge
Navbar: ExploreSG [Hertz]
                 Yellow badge
```

---

### 3. Lylo (ID: 103)

**UUID**: `ca9fd637-1c01-4ff8-9245-a0d41c910475`

**Brand Colors**:

- Text: `text-blue-600`
- Background: `bg-gray-200`

**Example Display**:

```
Dashboard: "Lylo Fleet Manager Dashboard" [Lylo]
                                          Blue badge
Navbar: ExploreSG [Lylo]
                 Blue badge
```

---

### 4. Budget (ID: 104)

**UUID**: `1c6a4a97-0608-41d4-b20d-e6cb023af975`

**Brand Colors**:

- Text: `text-red-600`
- Background: `bg-gray-200`

**Example Display**:

```
Dashboard: "Budget Fleet Manager Dashboard" [Budget]
                                            Red badge
Navbar: ExploreSG [Budget]
                 Red badge
```

---

### 5. Avis (ID: 105)

**UUID**: `ddb04738-d252-4dcb-8d69-ecab0aee8072`

**Brand Colors**:

- Text: `text-indigo-600`
- Background: `bg-indigo-200`

**Example Display**:

```
Dashboard: "Avis Fleet Manager Dashboard" [Avis]
                                          Indigo badge
Navbar: ExploreSG [Avis]
                 Indigo badge
```

---

## Implementation Details

### How It Works

1. **User Login**: When a FLEET_MANAGER logs in with their userId (UUID)
2. **UUID Lookup**: The system looks up the UUID in `OPERATOR_CONFIG`
3. **Brand Extraction**: Gets the operator name and brand styling
4. **Dynamic Rendering**: Applies the brand colors to badges and UI elements

### Code Example

```typescript
// User with Hertz UUID logs in
const userId = "92f04715-b828-4fc0-9013-81c3b468fcf1";

// System extracts operator info
const operatorInfo = getOperatorInfoFromUserId(userId);
// Returns:
// {
//   name: "Hertz",
//   id: 102,
//   styling: {
//     brand: "text-yellow-600 bg-gray-200",
//     background: "bg-black bg-blend-overlay bg-yellow-900/60"
//   }
// }

// Badge is rendered with Hertz brand colors
<span className={`rounded-md px-3 py-1 text-sm font-semibold ${operatorInfo.styling.brand}`}>
  {operatorInfo.name}
</span>
// Results in: <span class="rounded-md px-3 py-1 text-sm font-semibold text-yellow-600 bg-gray-200">Hertz</span>
```

## Responsive Design

- **Desktop**: Full badges visible in navbar and dashboard
- **Mobile**: Badges hidden in navbar to save space (`hidden sm:flex`)
- **Dashboard**: Always visible on all screen sizes

## Customization

To add a new operator or modify brand colors:

1. Add entry to `OPERATOR_CONFIG` in `src/types/rental.ts`
2. Specify unique UUID, name, and brand styling
3. Brand styling automatically applies to all UI components

Example:

```typescript
"new-uuid-here": {
  name: "Enterprise",
  id: 106,
  styling: {
    brand: "text-teal-700 bg-gray-200",
    background: "bg-black bg-blend-overlay bg-teal-900/80"
  }
}
```
