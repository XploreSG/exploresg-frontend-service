# Fleet List Page - Feature Documentation

## 🎯 Overview

The **Fleet List Page** provides a comprehensive, feature-rich table view of all vehicles in your fleet. It uses **TanStack Table (React Table v8)** for advanced table functionality including pagination, sorting, filtering, and search.

## ✨ Features

### 1. **Statistics Dashboard**

- **Total Fleet**: Shows the total number of vehicles
- **Available**: Count of vehicles ready for rental
- **In Use**: Count of vehicles currently rented
- **Maintenance**: Count of vehicles under maintenance

### 2. **Advanced Search**

- **Global Search**: Search across all columns (name, model, number plate)
- **Real-time Filtering**: Results update as you type
- **Smart Matching**: Case-insensitive search

### 3. **Status Filtering**

- **Quick Filter Buttons**: Filter by status with one click
- **Visual Feedback**: Active filter highlighted with color
- **Count Badges**: Shows number of vehicles in each status
- **Combined Filtering**: Works together with search

### 4. **Sortable Columns**

- **Click to Sort**: Click any column header to sort
- **Ascending/Descending**: Toggle between sort directions
- **Visual Indicators**: Arrow icons show current sort state
- **Multi-column Sort**: (can be enabled if needed)

### 5. **Pagination**

- **Page Size Selection**: Choose 5, 10, 20, or 50 items per page
- **Navigation Controls**: First, Previous, Next, Last buttons
- **Page Indicator**: Shows current page and total pages
- **Results Counter**: Shows "X to Y of Z results"

### 6. **Visual Design**

- **Vehicle Images**: Thumbnail preview for each vehicle
- **Status Badges**: Color-coded status indicators (green/amber/red)
- **Hover Effects**: Rows highlight on hover
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Empty State**: Friendly message when no results found

### 7. **Data Integration**

- **CAR_DATA Source**: Uses modular fleet data from `src/data/fleetData.ts`
- **Type Safety**: Full TypeScript support
- **Backend Ready**: Easy to swap with API data

## 📊 Table Columns

| Column           | Description       | Features                      |
| ---------------- | ----------------- | ----------------------------- |
| **Image**        | Vehicle thumbnail | Auto-fallback on error        |
| **Vehicle Name** | Name + Model      | Sortable, searchable          |
| **Number Plate** | License plate     | Monospace font, sortable      |
| **Model**        | Vehicle model     | Sortable, searchable          |
| **Status**       | Current status    | Color-coded badge, filterable |

## 🎨 Status Color Coding

- **🟢 Available** - Green badge (ready for rental)
- **🟡 In Use** - Amber badge (currently rented)
- **🔴 Maintenance** - Red badge (out of service)

## 🔧 Technical Details

### Dependencies

```json
{
  "@tanstack/react-table": "^8.x.x"
}
```

### Data Source

```typescript
import { CAR_DATA } from "../data/fleetData";
```

### Key Technologies

- **TanStack Table v8**: Advanced table functionality
- **React Hooks**: useState, useMemo for performance
- **Tailwind CSS**: Responsive styling
- **TypeScript**: Full type safety

## 📱 Responsive Behavior

### Desktop (1024px+)

- Full table with all columns visible
- Stats in 4-column grid
- Advanced pagination controls

### Tablet (768px - 1023px)

- Scrollable table
- Stats in 2-column grid
- Simplified pagination

### Mobile (<768px)

- Horizontal scroll for table
- Stats stacked vertically
- Previous/Next pagination only

## 🚀 Usage Examples

### Basic Usage (Current)

The page automatically loads data from `CAR_DATA`:

```typescript
import { CAR_DATA } from "../data/fleetData";

const data = useMemo<FleetTableData[]>(
  () =>
    CAR_DATA.map((car, index) => ({
      ...car,
      id: `fleet-${index + 1}`,
    })),
  [],
);
```

### With Backend API (Future)

Replace the data source:

```typescript
import { fetchFleetData } from "../services/fleetApiService";

const [data, setData] = useState<FleetTableData[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const fleetData = await fetchFleetData();
      const transformedData = fleetData.map((car, index) => ({
        ...car,
        id: `fleet-${index + 1}`,
      }));
      setData(transformedData);
    } catch (error) {
      console.error("Failed to load fleet data:", error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

## 🎯 User Interactions

### Search

1. User types in search box
2. Table filters in real-time
3. Pagination resets to page 1
4. Results counter updates

### Status Filter

1. User clicks status button (All, Available, In Use, Maintenance)
2. Table filters to show only matching vehicles
3. Button highlights with color
4. Search continues to work on filtered results

### Sorting

1. User clicks column header
2. Table sorts by that column (ascending)
3. Click again to reverse sort (descending)
4. Click third time to remove sort

### Pagination

1. User can change page size (5, 10, 20, 50)
2. Navigate between pages using controls
3. Jump to first or last page
4. Buttons disable when at boundaries

## 🔍 Search Behavior

The global search filters across these fields:

- Vehicle Name
- Vehicle Model
- Number Plate

**Example searches:**

- `"BMW"` - Shows all BMW vehicles
- `"SG"` - Shows all vehicles with "SG" in plate
- `"GTI"` - Shows Volkswagen Golf GTI
- `"Maintenance"` - Shows vehicles with status containing "Maintenance"

## 🎨 Customization

### Change Page Size Options

```typescript
{[5, 10, 20, 50].map((pageSize) => (
  <option key={pageSize} value={pageSize}>
    Show {pageSize}
  </option>
))}

// Change to: [10, 25, 50, 100]
```

### Change Default Page Size

```typescript
initialState: {
  pagination: {
    pageSize: 10,  // Change to desired default
  },
},
```

### Add New Column

```typescript
{
  accessorKey: "year",  // New field
  header: "Year",
  cell: (info) => (
    <span>{info.getValue() as number}</span>
  ),
}
```

### Custom Filter Function

```typescript
{
  accessorKey: "status",
  header: "Status",
  filterFn: "equals",  // or "includes", "startsWith", custom function
}
```

## 🧪 Testing

### Test Search

1. Enter "BMW" in search box
2. Should show 5 BMW vehicles
3. Clear search, should show all 16

### Test Status Filter

1. Click "Available" button
2. Should show 6 available vehicles
3. Click "All", should show all 16

### Test Combined Filtering

1. Click "In Use" button
2. Enter "SG" in search
3. Should show only in-use vehicles with "SG" in plate

### Test Sorting

1. Click "Vehicle Name" header
2. Should sort alphabetically A-Z
3. Click again, should reverse to Z-A

### Test Pagination

1. Set page size to 5
2. Should show 5 vehicles per page
3. Click "Next", should show next 5
4. Click "Last", should jump to final page

## 📊 Performance

### Optimizations

- **useMemo**: Data transformations are memoized
- **Column Definitions**: Memoized to prevent re-renders
- **Virtual Scrolling**: Can be added for very large datasets
- **Lazy Loading**: Can be implemented with backend pagination

### Current Performance

- **16 vehicles**: Instant rendering
- **100+ vehicles**: Still fast with pagination
- **1000+ vehicles**: Consider server-side pagination

## 🔮 Future Enhancements

### Possible Additions

1. **Export to CSV/Excel**: Download table data
2. **Column Visibility Toggle**: Show/hide columns
3. **Advanced Filters**: Date ranges, multi-select
4. **Bulk Actions**: Select multiple, perform actions
5. **Row Actions**: Edit, delete, view details buttons
6. **Column Resizing**: Drag to resize columns
7. **Saved Filters**: Save and recall filter presets
8. **Real-time Updates**: WebSocket for live data
9. **Row Expansion**: Click row to see more details
10. **Custom Views**: Save custom table configurations

## 📝 Notes

- The table automatically handles edge cases (empty data, no results)
- All interactions are keyboard accessible
- The design follows Tailwind CSS best practices
- The code is fully typed with TypeScript
- The component is ready for backend integration

## 🐛 Troubleshooting

### Images not loading

- Check files are in `public/assets/cars-logo/`
- Verify `file` field matches actual filename
- Fallback to default image on error

### Search not working

- Ensure global filter is enabled
- Check data contains searchable fields
- Verify search input is bound to state

### Pagination not working

- Verify `getPaginationRowModel()` is included
- Check initial state configuration
- Ensure page size is set

### Status filter not working

- Check `statusFilter` state is set correctly
- Verify filter logic in `filteredData` useMemo
- Ensure button click updates state

## 🎓 Learning Resources

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [React Table Examples](https://tanstack.com/table/latest/docs/examples/react/basic)
- [Tailwind CSS Tables](https://tailwindcss.com/docs/table-layout)
