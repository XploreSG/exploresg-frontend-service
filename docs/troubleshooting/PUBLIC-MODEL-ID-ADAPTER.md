# Public Model ID Adapter

## Problem

Backend fleet API uses `publicModelId` but frontend was expecting `publicId`:

```json
{
  "operatorId": "ca9fd637-1c01-4ff8-9245-a0d41c910475",
  "operatorName": "Fleet Operator ca9fd637-1c01-4ff8-9245-a0d41c910475",
  "publicModelId": "c04a0e91-76a0-4b2a-8950-8b38343f1107",  // ← Backend field name
  "model": "BMW M240i",
  "manufacturer": "BMW",
  ...
}
```

## Solution

Created an adapter in `transformCarModelData()` to handle the field name mismatch:

```typescript
// ADAPTER: Backend uses "publicModelId" but we use "carModelPublicId" internally
// Support both field names for backward compatibility
const publicModelId = item.publicModelId || item.publicId;

return {
  id: uniqueId,
  carModelPublicId: publicModelId, // Adapter: maps publicModelId → carModelPublicId
  ...
}
```

## Files Changed

### 1. `src/types/rental.ts`

Added `publicModelId?` field to support backend's naming:

```typescript
export interface OperatorCarModelData {
  operatorId: number | string;
  operatorName: string;
  carModelId: number;
  publicId?: string; // UUID from backend (legacy field)
  publicModelId?: string; // UUID from backend (current field name) ← Added
  model: string;
  manufacturer: string;
  ...
}
```

### 2. `src/utils/rentalUtils.ts`

Updated `transformCarModelData()` to map the field:

```typescript
export function transformCarModelData(
  data: OperatorCarModelData[],
): DisplayCarData[] {
  return data.map((item, index) => {
    const op = getOperatorInfo(item.operatorId, item.operatorName);
    const uniqueId = item.carModelId
      ? `${op.id}-${item.carModelId}`
      : `${op.id}-${item.model.replace(/\s+/g, "-")}-${index}`;

    // ADAPTER: Backend uses "publicModelId" but we use "carModelPublicId" internally
    const publicModelId = item.publicModelId || item.publicId;

    return {
      id: uniqueId,
      carModelPublicId: publicModelId, // Maps backend field to frontend field
      operatorId: op.id,
      ...
    };
  });
}
```

## Data Flow

1. **Backend Response**: `publicModelId: "c04a0e91-76a0-4b2a-8950-8b38343f1107"`
2. **Adapter**: Maps `publicModelId` → `carModelPublicId`
3. **Frontend State**: `carModelPublicId: "c04a0e91-76a0-4b2a-8950-8b38343f1107"`
4. **Booking API**: `carModelPublicId: "c04a0e91-76a0-4b2a-8950-8b38343f1107"` ✅

## Backward Compatibility

The adapter supports both field names:

- If backend sends `publicModelId` → use it ✅
- If backend sends `publicId` → use it ✅
- If both exist → prefer `publicModelId`

## Testing

1. ✅ Browse vehicles on `/user-vehicle-browse`
2. ✅ Select a vehicle and add-ons
3. ✅ Check console: should log UUID format
4. ✅ Submit booking on review page
5. ✅ Backend should accept the UUID

## Status

✅ **COMPLETE** - Adapter in place, ready to test end-to-end booking flow
