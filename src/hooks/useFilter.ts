import { useState } from "react";

interface UseFilterOptions {
  initialFilter: string;
}

export const useFilter = ({ initialFilter }: UseFilterOptions) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const resetFilter = () => {
    setSelectedFilter(initialFilter);
  };

  return {
    selectedFilter,
    handleFilterChange,
    resetFilter
  };
};
