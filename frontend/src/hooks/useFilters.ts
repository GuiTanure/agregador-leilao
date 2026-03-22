```typescript
import { useState, useEffect } from 'react';
import { PropertyFilters, FilterOptions, getFilterOptions } from '../services/api';

export const useFilters = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [options, setOptions] = useState<FilterOptions>({
    states: [],
    cities: [],
    neighborhoods: [],
    propertyTypes: [],
    auctionTypes: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      const data = await getFilterOptions();
      setOptions(data);
    };
    fetchOptions();
  }, []);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    filters,
    options,
    updateFilter,
    resetFilters,
  };
};
```