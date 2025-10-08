/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

// Partial API item shape used by the UI
export type ApiFleetItem = {
  id: string;
  licensePlate: string;
  status: string;
  carModel?: {
    model?: string;
    manufacturer?: string;
    imageUrl?: string;
  };
  currentLocation?: string;
  mileageKm?: number;
  dailyPrice?: number;
  availableFrom?: string | null;
  availableUntil?: string | null;
  maintenanceNote?: string | null;
  expectedReturnDate?: string | null;
};

type FleetContextValue = {
  fleet: ApiFleetItem[];
  setFleet: React.Dispatch<React.SetStateAction<ApiFleetItem[]>>;
};

const FleetContext = createContext<FleetContextValue | undefined>(undefined);

// Provider component for sharing fleet data across pages
export const FleetProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [fleet, setFleet] = useState<ApiFleetItem[]>([]);
  return (
    <FleetContext.Provider value={{ fleet, setFleet }}>
      {children}
    </FleetContext.Provider>
  );
};

// Hook to access fleet context
export const useFleetContext = () => {
  const ctx = useContext(FleetContext);
  if (!ctx)
    throw new Error("useFleetContext must be used within FleetProvider");
  return ctx;
};

// Note: no default export to keep this file exporting only components/hooks which
// plays nicer with React Fast Refresh in the dev server.
