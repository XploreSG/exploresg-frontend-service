// Custom hook for managing fleet data and filtering

import { useState, useEffect, useMemo } from "react";
import type {
  DisplayCarData,
  OperatorCarModelData,
  OperatorInfo,
} from "../types/rental";
import { DEFAULT_FILTER_STATE } from "../types/rental";
import { API_ENDPOINTS } from "../config/api";
import {
  transformCarModelData,
  sortCarData,
  filterCarData,
  getUniqueCategories,
  getUniqueSeats,
} from "../utils/rentalUtils";

export interface UseFleetDataReturn {
  // Data state
  carModels: DisplayCarData[];
  filteredCars: DisplayCarData[];
  isLoading: boolean;
  error: string | null;

  // Filter state
  sortBy: string;
  setSortBy: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  transmission: string;
  setTransmission: (value: string) => void;
  minSeats: string;
  setMinSeats: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedOperator: string;
  setSelectedOperator: (value: string) => void;

  // Derived data
  uniqueCategories: string[];
  uniqueSeats: number[];
  uniqueOperators: OperatorInfo[];

  // Actions
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
  refetch: () => void;
}

export function useFleetData(
  apiEndpoint: string = API_ENDPOINTS.FLEET.MODELS,
): UseFleetDataReturn {
  // Data state
  const [carModels, setCarModels] = useState<DisplayCarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [sortBy, setSortBy] = useState<string>(DEFAULT_FILTER_STATE.sortBy);
  const [vehicleType, setVehicleType] = useState<string>(
    DEFAULT_FILTER_STATE.vehicleType,
  );
  const [transmission, setTransmission] = useState<string>(
    DEFAULT_FILTER_STATE.transmission,
  );
  const [minSeats, setMinSeats] = useState<string>(
    DEFAULT_FILTER_STATE.minSeats,
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    DEFAULT_FILTER_STATE.priceRange,
  );
  const [selectedOperator, setSelectedOperator] = useState<string>(
    DEFAULT_FILTER_STATE.selectedOperator,
  );

  // Fetch data from backend
  const fetchCarModels = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OperatorCarModelData[] = await response.json();

      // Transform backend data to display format
      const displayData: DisplayCarData[] = transformCarModelData(data);

      setCarModels(displayData);
    } catch (err) {
      console.error("Failed to fetch car models:", err);
      setError(
        "Could not load vehicle data. Please check if the backend service is running.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint]);

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    return getUniqueCategories(carModels);
  }, [carModels]);

  const uniqueSeats = useMemo(() => {
    return getUniqueSeats(carModels);
  }, [carModels]);

  const uniqueOperators = useMemo(() => {
    // Deduplicate by operatorId
    const map = new Map<number, OperatorInfo>();
    carModels.forEach((car) => {
      if (!map.has(car.operatorId)) {
        map.set(car.operatorId, { id: car.operatorId, name: car.operator });
      }
    });

    const operators = Array.from(map.values());
    return operators.sort((a, b) => a.name.localeCompare(b.name));
  }, [carModels]);

  // Filter and sort logic
  const filteredCars = useMemo(() => {
    const filtered = filterCarData(carModels, {
      priceRange,
      vehicleType,
      minSeats,
      transmission,
      selectedOperator,
    });

    return sortCarData(filtered, sortBy);
  }, [
    carModels, // Add carModels as a dependency
    sortBy,
    vehicleType,
    minSeats,
    transmission,
    priceRange,
    selectedOperator,
  ]);

  const resetFilters = () => {
    setSortBy(DEFAULT_FILTER_STATE.sortBy);
    setVehicleType(DEFAULT_FILTER_STATE.vehicleType);
    setTransmission(DEFAULT_FILTER_STATE.transmission);
    setMinSeats(DEFAULT_FILTER_STATE.minSeats);
    setPriceRange(DEFAULT_FILTER_STATE.priceRange);
    setSelectedOperator(DEFAULT_FILTER_STATE.selectedOperator);
  };

  const hasActiveFilters = () => {
    return (
      sortBy !== DEFAULT_FILTER_STATE.sortBy ||
      vehicleType !== DEFAULT_FILTER_STATE.vehicleType ||
      minSeats !== DEFAULT_FILTER_STATE.minSeats ||
      transmission !== DEFAULT_FILTER_STATE.transmission ||
      priceRange[0] !== DEFAULT_FILTER_STATE.priceRange[0] ||
      priceRange[1] !== DEFAULT_FILTER_STATE.priceRange[1] ||
      selectedOperator !== DEFAULT_FILTER_STATE.selectedOperator
    );
  };

  return {
    // Data state
    carModels,
    filteredCars,
    isLoading,
    error,

    // Filter state
    sortBy,
    setSortBy,
    vehicleType,
    setVehicleType,
    transmission,
    setTransmission,
    minSeats,
    setMinSeats,
    priceRange,
    setPriceRange,
    selectedOperator,
    setSelectedOperator,

    // Derived data
    uniqueCategories,
    uniqueSeats,
    uniqueOperators,

    // Actions
    resetFilters,
    hasActiveFilters,
    refetch: fetchCarModels,
  };
}
