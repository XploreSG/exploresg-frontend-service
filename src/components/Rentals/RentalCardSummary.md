# RentalCardSummary Component Usage Guide

## 🎯 Overview

The `RentalCardSummary` component is a full-width variant of the RentalCard designed for use at the top of pages like PaymentPage and DriverDetailsPage.

## 📁 Component Location

```
src/components/Rentals/RentalCardSummary.tsx
```

## 🚀 Features

- **Full-width responsive layout** with 3-section grid
- **Large car image** with hover effects and shimmer animation
- **Detailed specifications** with icons and clear typography
- **Pricing information** with rental period calculation
- **Operator branding** with consistent color styling (Hertz=Yellow, Sixt=Orange)
- **Features bar** with checkmarks for benefits
- **Promo badge** support for special offers

## 💻 Usage Examples

### 1. PaymentPage Implementation

```tsx
import RentalCardSummary from "../components/Rentals/RentalCardSummary";

// In your component
{
  carDetails && (
    <div className="mb-8">
      <RentalCardSummary
        model={carDetails.model}
        seats={carDetails.seats}
        luggage={carDetails.luggage}
        transmission={carDetails.transmission}
        price={carDetails.price}
        originalPrice={carDetails.originalPrice}
        promoText={carDetails.promoText}
        imageUrl={carDetails.imageUrl}
        operator={carDetails.operator}
        operatorStyling={carDetails.operatorStyling}
        nights={bookingDates?.nights || 5}
        showPricing={true}
        className="mb-0"
      />
    </div>
  );
}
```

### 2. DriverDetailsPage Implementation

```tsx
import RentalCardSummary from "./RentalCardSummary";

// Same usage as above - component adapts automatically
```

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    BMW X3 xDrive20i                    [Hertz]  │
│                    or similar                          S$181/night│
│                                                                 │
│  [Large Car Image]    Vehicle Details        Rental Period     │
│      with hover       👥 5 passengers        ┌─────────────┐   │
│      effects          🎒 3 large bags        │      5      │   │
│                       ⚙️ Automatic trans     │   nights    │   │
│                                              └─────────────┘   │
│                                              Base Price: S$905  │
│                                                                 │
│  ✓ Unlimited mileage  ✓ 24/7 assistance  ✓ Free cancel ✓ Pet │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Props Interface

```tsx
interface RentalCardSummaryProps {
  model: string; // Car model name
  seats: number; // Number of passengers
  luggage: number; // Luggage capacity
  transmission: "automatic" | "manual";
  price: number; // Price per night
  originalPrice?: number; // Original price (shows strikethrough)
  promoText?: string; // Promo badge text
  imageUrl: string; // Car image URL
  operator: string; // "Hertz" or "Sixt"
  operatorStyling: string; // "text-yellow-400" or "text-orange-400"
  nights?: number; // Rental duration (default: 5)
  showPricing?: boolean; // Show pricing section (default: true)
  className?: string; // Additional CSS classes
}
```

## 🎯 Key Benefits

1. **Consistent branding** across booking flow
2. **Responsive design** works on all screen sizes
3. **Rich information display** without overwhelming the user
4. **Professional appearance** with gradients and animations
5. **Reusable component** for multiple pages

## 📱 Responsive Behavior

- **Desktop**: 3-column layout (Image | Details | Pricing)
- **Tablet**: Stacked sections with maintained proportions
- **Mobile**: Single column with optimized spacing

## 🔄 Integration Flow

```
UserVehicleBrowsePage (RentalCard)
    ↓ [Select Car]
AddOnsPage
    ↓ [Choose Add-ons]
DriverDetailsPage (RentalCardSummary) ← 📍 Full-width summary
    ↓ [Enter Details]
PaymentPage (RentalCardSummary) ← 📍 Full-width summary
    ↓ [Complete Booking]
Confirmation
```

## 🎨 Styling Notes

- Uses same gradient system as original RentalCard
- Operator colors automatically applied via `operatorStyling` prop
- Hover effects and animations included
- Backdrop blur effects for modern appearance
- Error handling for image loading failures

This component provides a professional, consistent way to display car information throughout your booking flow! 🚗✨
