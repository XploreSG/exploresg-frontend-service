# Operator UUID Mapping Documentation

## Overview

The rental system now supports UUIDs from the backend API while maintaining backward compatibility with numeric operator IDs (101, 102, etc.).

## How It Works

### 1. **Direct UUID Mapping**

The `OPERATOR_CONFIG` object directly maps UUIDs to operator information:

```typescript
export const OPERATOR_CONFIG = {
  "28dac4bd-e11a-4240-9602-c23fa8d8c510": {
    name: "Sixt",
    id: 101,
    styling: { ... }
  },
  "92f04715-b828-4fc0-9013-81c3b468fcf1": {
    name: "Hertz",
    id: 102,
    styling: { ... }
  },
  // ... more operators
};
```

### 2. **Automatic Conversion**

The `getOperatorInfo()` function automatically handles both UUID and numeric IDs:

```typescript
// Backend sends UUID
const operator = getOperatorInfo("28dac4bd-e11a-4240-9602-c23fa8d8c510");
// Returns: { id: 101, name: "Sixt", styling: {...} }

// Or using numeric ID (backward compatible)
const operator = getOperatorInfo(101);
// Returns: { id: 101, name: "Sixt", styling: {...} }
```

### 3. **Backend Response Format**

The `OperatorCarModelData` interface now accepts both formats:

```typescript
interface OperatorCarModelData {
  operatorId: number | string; // Can be UUID or numeric
  // ... other fields
}
```

## Usage Example

### Backend Response (with UUID)

```json
{
  "operatorId": "28dac4bd-e11a-4240-9602-c23fa8d8c510",
  "operatorName": "Sixt",
  "model": "BMW 3 Series"
  // ... other fields
}
```

### Automatic Transformation

The `transformCarModelData()` utility function automatically:

1. Receives the UUID from backend
2. Looks up the operator configuration
3. Converts to numeric ID (101)
4. Returns normalized data for the UI

```typescript
const displayCars = transformCarModelData(backendData);
// All cars will have numeric operatorId (101, 102, etc.)
```

## Operator Mappings

| UUID                                   | Numeric ID | Operator Name |
| -------------------------------------- | ---------- | ------------- |
| `28dac4bd-e11a-4240-9602-c23fa8d8c510` | 101        | Sixt          |
| `92f04715-b828-4fc0-9013-81c3b468fcf1` | 102        | Hertz         |
| `ca9fd637-1c01-4ff8-9245-a0d41c910475` | 103        | Lylo          |
| `1c6a4a97-0608-41d4-b20d-e6cb023af975` | 104        | Budget        |
| `ddb04738-d252-4dcb-8d69-ecab0aee8072` | 105        | Avis          |

## Adding New Operators

To add a new operator:

1. Add entry to `OPERATOR_CONFIG`:

```typescript
"new-uuid-here": {
  name: "NewOperator",
  id: 107,
  styling: {
    brand: "text-color-class bg-color-class",
    background: "bg-blend-class"
  }
}
```

2. Add to legacy configs (for backward compatibility):

```typescript
OPERATOR_NAMES[107] = "NewOperator";
OPERATOR_STYLES[107] = { ... };
```

## Benefits

✅ **Seamless Integration**: Backend can send UUIDs, frontend handles conversion automatically  
✅ **Backward Compatible**: Existing code using numeric IDs (101, 102) still works  
✅ **Single Source of Truth**: All operator info (name, styling) in one place  
✅ **Type Safe**: TypeScript ensures proper handling of both formats  
✅ **No Translation Needed**: Direct UUID → Config mapping (no intermediate steps)

## Files Modified

- `src/types/rental.ts` - Added `OPERATOR_CONFIG` and updated `getOperatorInfo()`
- `src/utils/rentalUtils.ts` - Updated `transformCarModelData()` to use new mapping
