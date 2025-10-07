// This file used to contain mock rental car data and helper utilities.
// The app now centralizes runtime models under `src/types/rental.ts` and
// fetches runtime data from the backend. Keep a tiny, type-only re-export
// here so legacy imports that expect types continue to work without
// including bulky runtime data.

// DEPRECATED: `rentalCars.ts` removed from runtime.
// This file previously contained mock rental data and helper functions.
// It has been intentionally emptied to prevent accidental runtime imports.
// If you need types, import them directly from `src/types/rental.ts`.

// Example:
// import type { CarDetailsWithPricing } from '../types/rental';

export {};
