# Fleet Dashboard Components

This document describes the reusable Chart.js components created for the Fleet Dashboard.

## Overview

The Fleet Dashboard uses a modular, component-based architecture where each chart and stat card is a separate, reusable React component.

## Type Definitions

**Location:** `src/types/dashboard.ts`

Defines the TypeScript interfaces for the dashboard API response:

- `DashboardResponse` - Main response structure
- `FleetByModel` - Individual fleet model data

## Components

### StatCard

**Location:** `src/components/fleet/StatCard.tsx`

A reusable card component for displaying key metrics.

**Props:**

- `title: string` - The card title
- `value: number | string` - The value to display
- `color?: "blue" | "green" | "yellow" | "red" | "purple" | "indigo"` - Color theme (default: "blue")
- `subtitle?: string` - Optional subtitle text

**Usage:**

```tsx
<StatCard title="Total Vehicles" value={59} color="blue" />
```

### VehicleStatusChart

**Location:** `src/components/fleet/VehicleStatusChart.tsx`

A doughnut chart showing the distribution of vehicles by status.

**Props:**

- `available: number` - Number of available vehicles
- `booked: number` - Number of booked vehicles
- `underMaintenance: number` - Number of vehicles under maintenance

**Usage:**

```tsx
<VehicleStatusChart available={47} booked={0} underMaintenance={12} />
```

### RevenueByModelChart

**Location:** `src/components/fleet/RevenueByModelChart.tsx`

A bar chart displaying revenue potential for each vehicle model.

**Props:**

- `fleetData: FleetByModel[]` - Array of fleet model data

**Usage:**

```tsx
<RevenueByModelChart fleetData={dashboardData.fleetByModel} />
```

### FleetCountByModelChart

**Location:** `src/components/fleet/FleetCountByModelChart.tsx`

A stacked bar chart showing the count of vehicles by model and status.

**Props:**

- `fleetData: FleetByModel[]` - Array of fleet model data

**Usage:**

```tsx
<FleetCountByModelChart fleetData={dashboardData.fleetByModel} />
```

### MileageComparisonChart

**Location:** `src/components/fleet/MileageComparisonChart.tsx`

A bar chart comparing average mileage across different vehicle models.

**Props:**

- `fleetData: FleetByModel[]` - Array of fleet model data

**Usage:**

```tsx
<MileageComparisonChart fleetData={dashboardData.fleetByModel} />
```

## Main Dashboard Page

## Usage

**Location:** `src/pages/FleetAdminDashboardPage.tsx`

The main dashboard page that orchestrates all components and manages the dashboard data state.

### Features:

- Fetches/loads dashboard data (currently using mock data)
- Displays loading state
- Organizes components into logical sections:
  - Vehicle Status
  - Fleet Statistics
  - Service & Operations
  - Fleet Analytics (Charts)

### Data Flow:

1. Component mounts and triggers `useEffect`
2. Mock data is loaded (replace with actual API call)
3. Data is destructured and passed to child components
4. Each component renders independently with its portion of the data

## Integration with Your API

### Backend Integration

To connect to your actual backend API, replace the mock data in `FleetAdminDashboardPage.tsx`:

```tsx
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard"); // Your API endpoint
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardData();
}, []);
```

## Benefits of This Architecture

1. **Reusability**: Each component can be used independently in other pages
2. **Maintainability**: Easy to update or fix individual components
3. **Testability**: Components can be tested in isolation
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Scalability**: Easy to add new charts or modify existing ones
6. **Performance**: Components only re-render when their props change

## Customization

Each chart component accepts the data it needs and handles its own configuration. To customize:

- **Colors**: Modify the `backgroundColor` and `borderColor` arrays in each component
- **Chart Options**: Edit the `options` object in each component
- **Layout**: Adjust the grid layout in `FleetAdminDashboardPage.tsx`
- **New Metrics**: Create new `StatCard` instances with your data

## Dependencies

- `chart.js` - Core charting library
- `react-chartjs-2` - React wrapper for Chart.js
- `react` - React framework
- `typescript` - Type definitions
